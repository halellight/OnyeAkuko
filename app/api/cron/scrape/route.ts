import { type NextRequest, NextResponse } from "next/server"
import { scrapeNigerianNews } from "@/lib/news-scraper"
import { supabaseAdmin } from "@/lib/supabase"
import { detectCategory, detectSentiment, detectRegion } from "@/lib/news"
import { withOluso } from "@oluso/nextjs"
import { oluso } from "@/instrumentation"

export const maxDuration = 60 // Allow Vercel up to 60 seconds execution time for scraping

export const GET = withOluso(oluso, async (request: Request) => {
  try {
    const authHeader = request.headers.get("Authorization")
    const { searchParams } = new URL(request.url)
    const force = searchParams.get("force") === "true"

    const isProd = process.env.NODE_ENV === "production"
    const cronSecret = process.env.CRON_SECRET

    // Secure in production, allow force or local execution easily
    if (isProd && !force) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    oluso.addBreadcrumb({ message: "Starting background scraping job", category: "cron", level: "info" })
    console.log("[cron-scraper] Starting background scraping job...")
    const scraped = await scrapeNigerianNews()
    console.log(`[cron-scraper] Scraper returned ${scraped.length} articles total.`)
    oluso.addBreadcrumb({
      message: `Scraper returned ${scraped.length} articles total`,
      category: "scraper",
      level: "info",
      data: { count: scraped.length }
    })

    if (scraped.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "Scraper yielded 0 articles. Database unmodified." })
    }

    // Map to Supabase table schema
    const mappedArticles = scraped.map((s, index) => {
      const title = s.title || ""
      let description = s.description || ""
      if (!description || description.length < 20) {
        description = `Read the full, detailed coverage of this story from ${s.source || "independent sources"}. Get multiple angles, compare coverage framing, and remain well-informed.`
      }

      return {
        title: title,
        description: description,
        source: s.source,
        category: detectCategory(title, description),
        sentiment: detectSentiment(title, description),
        region: detectRegion(title, description),
        date: s.date || new Date().toISOString(),
        image_url: s.imageUrl || "/Group728.png",
        link: s.link || "#",
        credibility: 0.85
      }
    })

    // Filter out internal duplicate titles within the scraped batch before upserting
    const uniqueMappedArticles = mappedArticles.filter(
      (article, index, self) => self.findIndex((a) => a.title.trim() === article.title.trim()) === index
    )

    // Upsert into Supabase (uniqueness is matched on 'title' to prevent duplicate articles)
    console.log(`[cron-scraper] Upserting ${uniqueMappedArticles.length} unique mapped articles into Supabase...`)
    const { data, error } = await supabaseAdmin
      .from("articles")
      .upsert(uniqueMappedArticles, { onConflict: "title", ignoreDuplicates: true })

    if (error) {
      console.error("[cron-scraper] Database upsert failed:", error)
      throw error
    }

    // Signal heartbeat on successful run
    const heartbeatUrl = process.env.OLUSO_SCRAPER_HEARTBEAT_URL || process.env.OLUSO_HEARTBEAT_URL
    if (heartbeatUrl) {
      await oluso.heartbeat(heartbeatUrl, {
        context: { count: uniqueMappedArticles.length }
      }).catch(e => console.warn("[cron-scraper] Oluso heartbeat ping failed:", e))
    }

    return NextResponse.json({
      success: true,
      count: uniqueMappedArticles.length,
      message: `Successfully scraped, mapped, and upserted ${uniqueMappedArticles.length} unique articles into Supabase 'articles' cache table.`
    })

  } catch (error: any) {
    console.error("[cron-scraper] Fatal Scraper Job Error:", error)
    await oluso.captureException(error instanceof Error ? error : new Error(String(error)), {
      job: "scrapeNigerianNews"
    })

    const heartbeatUrl = process.env.OLUSO_SCRAPER_HEARTBEAT_URL || process.env.OLUSO_HEARTBEAT_URL
    if (heartbeatUrl) {
      await oluso.heartbeat(heartbeatUrl, {
        status: "failed",
        message: error.message || String(error),
        evidence: { error: String(error) }
      }).catch(() => {})
    }

    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 })
  }
})
