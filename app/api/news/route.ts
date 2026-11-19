import { type NextRequest, NextResponse } from "next/server"
import { getNews, fallbackArticles, fallbackElectionArticles } from "@/lib/news"
import { withOluso } from "@oluso/nextjs"
import { oluso } from "@/instrumentation"

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

// 📡 Main API Route (GET)
export const GET = withOluso(oluso, async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const region = searchParams.get("region") || "all"
    const sentiment = searchParams.get("sentiment") || "all"
    const topic = searchParams.get("topic") || searchParams.get("tag") || undefined
    const search = searchParams.get("q") || searchParams.get("search") || searchParams.get("query") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined
    const format = searchParams.get("format") || "stories"

    // If a specific topic or search query is requested without explicit timeRange, default to "all" to prevent empty results
    const defaultTimeRange = (topic || search) ? "all" : "today"
    const timeRange = searchParams.get("timeRange") || defaultTimeRange

    oluso.addBreadcrumb({
      message: "Fetching news articles",
      category: "news-api",
      level: "info",
      data: { category, region, sentiment, timeRange, topic, search, limit },
    })

    const articles = await getNews({ category, region, sentiment, timeRange, search, topic, limit })

    // Optional format flattening if a client prefers flat articles list over grouped stories
    const responsePayload = format === "flat"
      ? articles.flatMap((story: any) => (story.articles && story.articles.length > 0 ? story.articles : [story]))
      : articles

    return NextResponse.json(responsePayload, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("[news-api] GET Error:", error)
    await oluso.captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: "app/api/news",
      fallbackUsed: true,
    })
    const isElection = new URL(request.url).searchParams.get("topic") === "election"
    return NextResponse.json(isElection ? fallbackElectionArticles : fallbackArticles, {
      headers: CORS_HEADERS,
    })
  }
})

// 📡 Main API Route (POST - for legacy support)
export const POST = withOluso(oluso, async (request: Request, ctx: any) => {
  return GET(request, ctx)
})
