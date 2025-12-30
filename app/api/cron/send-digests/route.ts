import { type NextRequest, NextResponse } from "next/server"
import { getNews } from "@/lib/news"
import { processDigestSending } from "@/lib/notifications"

export async function GET(request: NextRequest) {
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
    let digestTime: "Morning" | "Evening" | null = null

    if (forceTime === "Morning" || forceTime === "Evening") {
      digestTime = forceTime
    } else if (currentHour === 9) {
      digestTime = "Morning"
    } else if (currentHour === 17) { // Evening digest (5 PM UTC = 6 PM Local)
      digestTime = "Evening"
    }

    if (!digestTime) {
      console.log(`[Cron] Not a scheduled time (Hour: ${currentHour} UTC) and no force param.`)
      return NextResponse.json({ message: "Not a scheduled digest time", hour: currentHour }, { status: 200 })
    }

    console.log(`[Cron] Triggering ${digestTime} digest...`)

    const articles = await getNews({ region: "nigeria", timeRange: "today" })
    const digestArticles = articles.slice(0, 5)

    // Send emails directly (skips origin fetch)
    const sendResult = await processDigestSending({ articles: digestArticles, digestTime })

    console.log(`[Cron] ${digestTime} digest completed:`, sendResult)

    return NextResponse.json({
      message: `${digestTime} digest process completed`,
      ...sendResult,
    })
  } catch (error) {
    console.error("[Cron] Critical error:", error)
    return NextResponse.json({ error: "Failed to process cron job", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
