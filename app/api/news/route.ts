import { type NextRequest, NextResponse } from "next/server"
// import { scrapeNigerianNews } from "@/lib/news-scraper"

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

// 🖼️ Fix and Validate Image URLs
function getImageUrl(article: any): string {
  if (article.image && typeof article.image === "string") {
    let img = article.image.trim()

    // Convert insecure URLs
    if (img.startsWith("http://")) img = img.replace("http://", "https://")

    // Filter out invalid cases
    if (img.startsWith("https://") && !img.includes("undefined") && !img.endsWith("/")) {
      return img
    }
  }
  // ✅ Fallback image in /public
  return "/nigerian-tech-startup.jpg"
}

// 💾 Fallback Articles (when API fails)
const fallbackArticles = [
  {
    id: "fallback-1",
    title: "Nigeria's Tech Startups Raise $500M in 2024",
    description:
      "Nigerian tech entrepreneurs continue to attract global investment, with Lagos emerging as Africa's leading tech hub. The surge in funding reflects growing confidence in Nigerian innovation.",
    source: "TechCabal",
    category: "technology",
    sentiment: "positive",
    region: "nigeria",
    date: new Date().toISOString(), // Fresh today
    imageUrl: "/nigerian-tech-startup.jpg",
    link: "https://techcabal.com",
    credibility: 0.9,
  },
  {
    id: "fallback-2",
    title: "Lagos Launches New Fintech Regulation Framework",
    description:
      "The Central Bank of Nigeria introduces comprehensive fintech guidelines to support financial innovation while maintaining regulatory oversight in Africa's largest financial market.",
    source: "Punch Nigeria",
    category: "business",
    sentiment: "positive",
    region: "nigeria",
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    imageUrl: "/nigerian-fintech.jpg",
    link: "https://punchng.com",
    credibility: 0.88,
  },
  {
    id: "fallback-3",
    title: "African Tech Leaders Gather for Innovation Summit",
    description:
      "Leading tech entrepreneurs from across Africa convene to discuss digital transformation, startup ecosystem development, and opportunities in emerging technologies.",
    source: "Daily Trust",
    category: "technology",
    sentiment: "neutral",
    region: "africa",
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    imageUrl: "/african-tech-summit.jpg",
    link: "https://dailytrust.com.ng",
    credibility: 0.87,
  },
]

// 📡 Main API Route
export async function GET() {
  return NextResponse.json({
    message: "OnyeAkuko News API is active. Use POST to fetch articles with filters.",
    status: "active"
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category = "all", region = "all", sentiment = "all", timeRange = "today" } = body

    const allArticles: any[] = []

    console.log(`[news-api] Request filters: Category=${category}, Region=${region}, Sentiment=${sentiment}, TimeRange=${timeRange}`)

    // 🇳🇬 Scrape Nigerian News
    try {
      console.log(`[news-api] Fetching fresh news via Scraper...`)
      // const scraped = await scrapeNigerianNews()
      const scraped: any[] = []
      if (scraped && scraped.length > 0) {
        console.log(`[news-api] Scraper returned ${scraped.length} articles`)
        const formattedScraped = scraped.map(s => ({
          ...s,
          id: `scraped-${Math.random().toString(36).substr(2, 9)}`,
          published_at: s.date
        }))
        allArticles.push(...formattedScraped)
      } else {
        console.log("[news-api] Scraper returned no articles")
      }
    } catch (e) {
      console.error("[news-api] Scraper failed:", e)
    }

    // 📡 Fetch from Mediastack
    if (MEDIASTACK_API_KEY) {
      try {
        // Map region to country codes
        let countries = ""
        if (region === "nigeria") countries = "ng"
        else if (region === "africa") countries = "ng,za,ke,gh"

        // Map category
        let categories = ""
        if (category !== "all") categories = category

        const url = `${MEDIASTACK_URL}?access_key=${MEDIASTACK_API_KEY}${countries ? `&countries=${countries}` : ""}${categories ? `&categories=${categories}` : ""}&languages=en&limit=50&sort=published_desc`

        console.log(`[news-api] Fetching from Mediastack: ${region}`)
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data.data && Array.isArray(data.data)) {
            console.log(`[news-api] Mediastack returned ${data.data.length} articles`)
            allArticles.push(...data.data)
          }
        } else {
          console.log("[news-api] Mediastack returned status:", response.status)
        }
      } catch (e) {
        console.log("[news-api] Mediastack query failed:", e instanceof Error ? e.message : String(e))
      }
    }

    // Use fallback articles if everything else fails
    if (allArticles.length === 0) {
      console.log("[news-api] No articles from scraper or Mediastack, using fallback data")
      allArticles.push(...fallbackArticles)
    }

    // 🧠 Transform + Clean Articles
    const articles = allArticles
      .filter(isQualityArticle)
      .map((article: any, index: number) => {
        const date = article.published_at || article.date || new Date().toISOString()
        return {
          id: article.id || `${index}-${Date.now()}`,
          title: article.title,
          description: article.description || "",
          source: article.source || "Unknown",
          category: detectCategory(article.title, article.description),
          sentiment: detectSentiment(article.title, article.description),
          region: detectRegion(article.title, article.description),
          date: date,
          imageUrl:
            article.imageUrl ||
            article.image ||
            article.urlToImage ||
            "https://assets.mediastack.com/images/articles/default.jpg",
          link: article.url || article.link || "https://mediastack.com",
          credibility:
            article.source?.toLowerCase().includes("bbc") ||
              article.source?.toLowerCase().includes("reuters")
              ? 0.95
              : 0.85,
        }
      })
      .filter((article, index, self) => self.findIndex((a) => a.title === article.title) === index)

    console.log(`[news-api] Articles after quality filter/deduplication: ${articles.length}`)

    // 📅 Filter by Time Range
    const now = new Date()
    let filteredByTime = articles
    if (timeRange === "today") {
      // Use 36 hours for "today" to be more resilient to timezones and late-night scraping
      const thirtySixHoursAgo = now.getTime() - (36 * 60 * 60 * 1000)
      filteredByTime = articles.filter(a => new Date(a.date).getTime() >= thirtySixHoursAgo)
    } else if (timeRange === "week") {
      const lastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000)
      filteredByTime = articles.filter(a => new Date(a.date).getTime() >= lastWeek)
    } else if (timeRange === "month") {
      const lastMonth = now.getTime() - (30 * 24 * 60 * 60 * 1000)
      filteredByTime = articles.filter(a => new Date(a.date).getTime() >= lastMonth)
    }

    console.log(`[news-api] Articles after time filter (${timeRange}): ${filteredByTime.length}`)

    // Filter by sentiment if specified
    let filtered = filteredByTime
    if (sentiment !== "all") filtered = filtered.filter((a) => a.sentiment === sentiment)

    console.log(`[news-api] Final count being returned: ${filtered.length}`)

    return NextResponse.json(filtered, {
      headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate" },
    })
  } catch (error) {
    console.error("[news-api] Route error:", error)
    return NextResponse.json(fallbackArticles)
  }
}
