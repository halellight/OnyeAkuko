import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Cron] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Determine which digest to send based on current hour (UTC) or query param
    const { searchParams } = new URL(request.url)
    const forceTime = searchParams.get("force") // "Morning" or "Evening"

    const currentHour = new Date().getUTCHours()
    let digestTime: "Morning" | "Evening" | null = null

    if (forceTime === "Morning" || forceTime === "Evening") {
      digestTime = forceTime
    } else if (currentHour === 9) {
      digestTime = "Morning"
    } else if (currentHour === 19) {
      digestTime = "Evening"
    }

    if (!digestTime) {
      console.log(`[Cron] Not a scheduled time (Hour: ${currentHour} UTC) and no force param.`)
      return NextResponse.json({ message: "Not a scheduled digest time", hour: currentHour }, { status: 200 })
    }

    console.log(`[Cron] Triggering ${digestTime} digest...`)

    // Fetch latest articles
    const origin = request.nextUrl.origin
    const articlesResponse = await fetch(`${origin}/api/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: "ng" }), // Prioritize Nigerian news for digest
    })

    if (!articlesResponse.ok) {
      throw new Error(`Failed to fetch articles: ${articlesResponse.statusText}`)
    }

    const articles = await articlesResponse.json()
    const digestArticles = articles.slice(0, 5)

    // Trigger the send route
    // We don't pass 'subscribers' here so the send route fetches them from Supabase
    const sendResponse = await fetch(`${origin}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articles: digestArticles,
        digestTime,
      }),
    })

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text()
      throw new Error(`Send route failed: ${errorText}`)
    }

    const sendResult = await sendResponse.json()

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
