export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { scrapeNigerianNews } from "@/lib/news-scraper"

const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY
const MEDIASTACK_URL = "https://api.mediastack.com/v1/news" // ✅ HTTPS

// 🧠 Sentiment Detection
function detectSentiment(title: string, description: string): "positive" | "negative" | "neutral" {
  const text = (title + " " + description).toLowerCase()

  const positiveWords = [
    "growth", "success", "achieve", "improve", "advance", "boost", "surge",
    "record", "gain", "profit", "launch", "innovation", "investment", "partnership",
  ]
  const negativeWords = [
    "decline", "loss", "crisis", "drop", "fail", "worse", "concern", "risk",
    "threat", "attack", "bankruptcy", "layoff", "controversy",
  ]

  const positiveCount = positiveWords.filter((word) => text.includes(word)).length
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}

// 🏷️ Category Detection
function detectCategory(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase()
  if (text.match(/tech|software|ai|startup|digital|app|crypto|fintech/)) return "technology"
  if (text.match(/business|market|trade|economy|finance/)) return "business"
  if (text.match(/government|politics|election|policy/)) return "politics"
  if (text.match(/culture|film|music|entertainment|fashion/)) return "culture"
  if (text.match(/science|research|energy|health/)) return "science"
  return "world"
}

// 🌍 Region Detection
function detectRegion(title: string, description: string): "global" | "africa" | "nigeria" {
  const text = (title + " " + description).toLowerCase()
  if (text.includes("nigeria") || text.includes("lagos") || text.includes("abuja")) return "nigeria"
  if (text.match(/africa|kenya|ghana|south africa|uganda/)) return "africa"
  return "global"
}

// ✅ Validate article quality
function isQualityArticle(article: any): boolean {
  if (!article.title || !article.description) return false
  if (article.description.length < 20) return false

  const source = (article.source || "").toLowerCase()
  const blockedSources = ["reddit", "quora", "gossip", "medium", "tabloid"]
  if (blockedSources.some((blocked) => source.includes(blocked))) return false

  return true
}

// 💾 Fallback Articles
const fallbackArticles = [
  {
    id: "fallback-1",
    title: "Nigeria's Tech Startups Raise $500M in 2024",
    description: "Nigerian tech entrepreneurs continue to attract global investment, with Lagos emerging as Africa's leading tech hub.",
    source: "TechCabal",
    category: "technology",
    sentiment: "positive",
    region: "nigeria",
    date: new Date().toISOString(),
    imageUrl: "/nigerian-tech-startup.jpg",
    link: "https://techcabal.com",
    credibility: 0.9,
  },
  {
    id: "fallback-2",
    title: "Lagos Launches New Fintech Regulation Framework",
    description: "The Central Bank of Nigeria introduces comprehensive fintech guidelines to support financial innovation.",
    source: "Punch Nigeria",
    category: "business",
    sentiment: "positive",
    region: "nigeria",
    date: new Date(Date.now() - 3600000).toISOString(),
    imageUrl: "/nigerian-fintech.jpg",
    link: "https://punchng.com",
    credibility: 0.88,
  },
]

// 📡 Main API Route
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  Riverside
  try {
    const body = await request.json()
    const { category = "all", region = "all", sentiment = "all", timeRange = "today" } = body

    const allArticles: any[] = []
    console.log(`[news-api] Request: Category=${category}, Region=${region}, TimeRange=${timeRange}`)

    // 🇳🇬 Scraper (Optimized/Parallel)
    try {
      const scraped = await scrapeNigerianNews()
      if (scraped && scraped.length > 0) {
        allArticles.push(...scraped.map(s => ({
          ...s,
          id: `scraped-${Math.random().toString(36).substr(2, 9)}`,
          published_at: s.date
        })))
      }
    } catch (e) {
      console.error("[news-api] Scraper failed:", e)
    }

    // 📡 Mediastack
    if (MEDIASTACK_API_KEY) {
      try {
        let countries = region === "nigeria" ? "ng" : (region === "africa" ? "ng,za,ke,gh" : "")
        let categories = category !== "all" ? category : ""
        const url = `${MEDIASTACK_URL}?access_key=${MEDIASTACK_API_KEY}${countries ? `&countries=${countries}` : ""}${categories ? `&categories=${categories}` : ""}&languages=en&limit=50&sort=published_desc`

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data.data) allArticles.push(...data.data)
        }
      } catch (e) {
        console.error("[news-api] Mediastack failed:", e)
      }
    }

    if (allArticles.length === 0) allArticles.push(...fallbackArticles)

    // Transform & Filter
    const articles = allArticles
      .filter(isQualityArticle)
      .map((article: any, index: number) => ({
        id: article.id || `${index}-${Date.now()}`,
        title: article.title,
        description: article.description || "",
        source: article.source || "Unknown",
        category: detectCategory(article.title, article.description),
        sentiment: detectSentiment(article.title, article.description),
        region: detectRegion(article.title, article.description),
        date: article.published_at || article.date || new Date().toISOString(),
        imageUrl: article.imageUrl || article.image || "/nigerian-tech-startup.jpg",
        link: article.url || article.link || "#",
        credibility: 0.85,
      }))
      .filter((article, index, self) => self.findIndex((a) => a.title === article.title) === index)

    // Time Filtering (Resilient 36h window)
    const now = new Date()
    let filtered = articles
    if (timeRange === "today") {
      const thirtySixHoursAgo = now.getTime() - (36 * 60 * 60 * 1000)
      filtered = articles.filter(a => new Date(a.date).getTime() >= thirtySixHoursAgo)
    }

    if (sentiment !== "all") filtered = filtered.filter(a => a.sentiment === sentiment)

    console.log(`[news-api] Returning ${filtered.length} articles`)
    return NextResponse.json(filtered)
  } catch (error) {
    console.error("[news-api] POST Error:", error)
    return NextResponse.json(fallbackArticles)
  }
}
