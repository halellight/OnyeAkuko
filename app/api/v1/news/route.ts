import { NextResponse } from "next/server"
import { getNews, fallbackArticles, fallbackElectionArticles } from "@/lib/news"

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, X-Api-Key",
  "Access-Control-Max-Age": "86400",
}

// 🌐 Handle CORS Preflight Requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// 📡 Public v1 News API (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const region = searchParams.get("region") || "all"
    const sentiment = searchParams.get("sentiment") || "all"
    const topic = searchParams.get("topic") || searchParams.get("tag") || undefined
    const search = searchParams.get("q") || searchParams.get("search") || searchParams.get("query") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20
    const wrap = searchParams.get("wrap") !== "false"
    const format = searchParams.get("format") || "stories"

    // Default to "all" timeRange if topic or search is provided, so callers don't get 0 results on off-peak hours
    const defaultTimeRange = (topic || search) ? "all" : "today"
    const timeRange = searchParams.get("timeRange") || defaultTimeRange

    const rawData = await getNews({
      category,
      region,
      sentiment,
      timeRange,
      search,
      topic,
      limit,
    })

    const payload = format === "flat"
      ? rawData.flatMap((story: any) => (story.articles && story.articles.length > 0 ? story.articles : [story]))
      : rawData

    if (!wrap) {
      return NextResponse.json(payload, {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      })
    }

    return NextResponse.json({
      status: "success",
      count: payload.length,
      topic: topic || "all",
      category,
      region,
      attribution: {
        provider: "OnyeAkụkọ",
        url: "https://onyeakuko.online",
        notice: "Powered by OnyeAkụkọ Media Intelligence",
      },
      data: payload,
    }, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("[public-v1-news-api] GET Error:", error)
    const isElection = new URL(request.url).searchParams.get("topic") === "election"
    const fallback = isElection ? fallbackElectionArticles : fallbackArticles

    return NextResponse.json({
      status: "degraded",
      count: fallback.length,
      fallbackUsed: true,
      data: fallback,
      attribution: {
        provider: "OnyeAkụkọ",
        url: "https://onyeakuko.online",
      },
    }, {
      status: 200,
      headers: CORS_HEADERS,
    })
  }
}
