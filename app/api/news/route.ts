import { type NextRequest, NextResponse } from "next/server"
import { getNews, fallbackArticles } from "@/lib/news"

// 📡 Main API Route (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const region = searchParams.get("region") || "all"
    const sentiment = searchParams.get("sentiment") || "all"
    const timeRange = searchParams.get("timeRange") || "today"

    const articles = await getNews({ category, region, sentiment, timeRange })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("[news-api] GET Error:", error)
    return NextResponse.json(fallbackArticles)
  }
}

// 📡 Main API Route (POST - for legacy support)
export async function POST(request: NextRequest) {
  return GET(request)
}
