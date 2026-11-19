import { type NextRequest, NextResponse } from "next/server"
import { getNews, scrapeAndUpsertNews } from "@/lib/news"
import { processDigestSending } from "@/lib/notifications"
import { withOluso } from "@oluso/nextjs"
import { oluso } from "@/instrumentation"

export const GET = withOluso(oluso, async (request: Request) => {
  let digestTime: "Morning" | "Evening" | null = null
  try {
    // ... verification logic ...
    // (keep current verification)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Cron] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const forceTime = searchParams.get("force")

    const currentHour = new Date().getUTCHours()

    if (forceTime === "Morning" || forceTime === "Evening") {
      digestTime = forceTime
    } else if (currentHour === 8) {
      digestTime = "Morning"
    } else if (currentHour === 16) { // Evening digest (4 PM UTC = ~6 PM WAT accounting for send lag)
      digestTime = "Evening"
    }

    if (!digestTime) {
      console.log(`[Cron] Not a scheduled time (Hour: ${currentHour} UTC) and no force param.`)
      return NextResponse.json({ message: "Not a scheduled digest time", hour: currentHour }, { status: 200 })
    }

    oluso.addBreadcrumb({
      message: `Triggering ${digestTime} digest`,
      category: "cron",
      level: "info",
      data: { digestTime, currentHour }
    })
    console.log(`[Cron] Triggering ${digestTime} digest...`)

    console.log("[Cron] Running synchronous scraping check...")
    try {
      await scrapeAndUpsertNews()
    } catch (err) {
      console.error("[Cron] Synchronous scraping failed, continuing to compile digest with existing database cache:", err)
      oluso.addBreadcrumb({
        message: "Synchronous scraping before digest compilation encountered an error",
        category: "scraper",
        level: "warning"
      })
    }

    const timeRange = digestTime === "Morning" ? "morning" : "evening"
    const articles = await getNews({ region: "nigeria", timeRange })
    const digestArticles = articles.slice(0, 5)

    // Send emails directly (skips origin fetch)
    const sendResult = await processDigestSending({ articles: digestArticles, digestTime })

    console.log(`[Cron] ${digestTime} digest completed:`, sendResult)

    // Signal heartbeat on successful run
    const heartbeatUrl = process.env.OLUSO_DIGEST_HEARTBEAT_URL || process.env.OLUSO_HEARTBEAT_URL
    if (heartbeatUrl) {
      await oluso.heartbeat(heartbeatUrl, {
        context: { digestTime, sendResult }
      }).catch(e => console.warn("[Cron] Oluso heartbeat ping failed:", e))
    }

    return NextResponse.json({
      message: `${digestTime} digest process completed`,
      ...sendResult,
    })
  } catch (error) {
    console.error("[Cron] Critical error:", error)
    await oluso.captureException(error instanceof Error ? error : new Error(String(error)), {
      job: "send-digests",
      digestTime: digestTime || "unknown"
    })

    const heartbeatUrl = process.env.OLUSO_DIGEST_HEARTBEAT_URL || process.env.OLUSO_HEARTBEAT_URL
    if (heartbeatUrl) {
      await oluso.heartbeat(heartbeatUrl, {
        status: "failed",
        message: error instanceof Error ? error.message : String(error),
        evidence: { error: String(error) }
      }).catch(() => {})
    }

    return NextResponse.json({ error: "Failed to process cron job", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
})
