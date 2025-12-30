import { type NextRequest, NextResponse } from "next/server"
import { processDigestSending } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const { subscribers, articles, digestTime } = await request.json()

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: "No articles provided" }, { status: 400 })
    }

    const result = await processDigestSending({ subscribers, articles, digestTime })

    return NextResponse.json({
      message: "Digest sending completed",
      ...result
    })
  } catch (error) {
    console.error("Digest send error:", error)
    return NextResponse.json({ error: "Failed to send digest" }, { status: 500 })
  }
}
