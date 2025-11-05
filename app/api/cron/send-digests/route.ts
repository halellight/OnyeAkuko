import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Determine which digest to send based on current hour (UTC)
    const currentHour = new Date().getUTCHours()
    let digestTime: "Morning" | "Evening"
    let filterMorning: boolean

    // 9 AM UTC = Morning digest
    // 19 (7 PM) UTC = Evening digest
    if (currentHour === 9) {
      digestTime = "Morning"
      filterMorning = true
    } else if (currentHour === 19) {
      digestTime = "Evening"
      filterMorning = false
    } else {
      return NextResponse.json({ message: "Not a scheduled digest time" }, { status: 200 })
    }

    // Fetch subscribers (in production, query from database)
    const subsResponse = await fetch(`${request.nextUrl.origin}/api/notifications/subscribe`, {
      method: "GET",
    })
    const subsData = await subsResponse.json()
    const allSubscribers = subsData.subscriptions || []

    // Filter subscribers based on digest time preference
    const filteredSubscribers = allSubscribers
      .filter((sub: any) => {
        if (filterMorning) {
          return sub.digestTimes?.morning === true
        } else {
          return sub.digestTimes?.evening === true
        }
      })
      .map((sub: any) => sub.email)

    if (filteredSubscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers for this digest time" }, { status: 200 })
    }

    // Fetch latest articles
    const articlesResponse = await fetch(`${request.nextUrl.origin}/api/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const articles = await articlesResponse.json()

    // Send digest
    const sendResponse = await fetch(`${request.nextUrl.origin}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscribers: filteredSubscribers,
        articles: articles.slice(0, 5),
        digestTime,
      }),
    })

    const sendResult = await sendResponse.json()

    return NextResponse.json({
      message: `${digestTime} digest sent successfully`,
      ...sendResult,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Failed to send digests" }, { status: 500 })
  }
}
