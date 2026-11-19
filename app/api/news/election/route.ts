import { NextResponse } from "next/server"
import { getNews, fallbackElectionArticles } from "@/lib/news"

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, X-Api-Key",
  "Access-Control-Max-Age": "86400",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// 🗳️ Dedicated 2027 Election Updates Endpoint (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10
    const format = searchParams.get("format") || "stories"

    const stories = await getNews({
      topic: "election",
      timeRange: "all",
      limit,
    })

    const payload = format === "flat"
      ? stories.flatMap((story: any) => (story.articles && story.articles.length > 0 ? story.articles : [story]))
      : stories

    return NextResponse.json(payload, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("[api-news-election] Error:", error)
    return NextResponse.json(fallbackElectionArticles, {
      headers: CORS_HEADERS,
    })
  }
}
