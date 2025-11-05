import { type NextRequest, NextResponse } from "next/server"

const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const NEWSAPI_URL = "https://newsapi.org/v2"

function detectSentiment(title: string, description: string): "positive" | "negative" | "neutral" {
  const text = (title + " " + description).toLowerCase()

  const positiveWords = [
    "growth",
    "success",
    "achieve",
    "improve",
    "advance",
    "boost",
    "surge",
    "record",
    "gain",
    "profit",
    "launch",
    "innovation",
    "investment",
    "partnership",
  ]
  const negativeWords = [
    "decline",
    "loss",
    "crisis",
    "drop",
    "fail",
    "worse",
    "concern",
    "risk",
    "threat",
    "attack",
    "bankruptcy",
    "layoff",
    "controversy",
  ]

  const positiveCount = positiveWords.filter((word) => text.includes(word)).length
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}

function detectCategory(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase()

  if (
    text.includes("tech") ||
    text.includes("software") ||
    text.includes("ai") ||
    text.includes("startup") ||
    text.includes("digital") ||
    text.includes("app") ||
    text.includes("crypto") ||
    text.includes("fintech")
  )
    return "technology"
  if (text.includes("business") || text.includes("market") || text.includes("trade") || text.includes("economy"))
    return "business"
  if (text.includes("government") || text.includes("politics") || text.includes("election")) return "politics"
  if (text.includes("culture") || text.includes("film") || text.includes("music") || text.includes("entertainment"))
    return "culture"
  if (text.includes("science") || text.includes("research") || text.includes("energy") || text.includes("health"))
    return "science"

  return "world"
}

function isQualityArticle(article: any): boolean {
  if (!article.title || !article.description) return false

  const text = (article.title + " " + article.description).toLowerCase()
  const source = (article.source?.name || article.source || "").toLowerCase()

  const blockedSources = [
    "clarkes world",
    "clarke's world",
    "science fiction",
    "fantasy magazine",
    "medium",
    "reddit",
    "quora",
    "gossip",
  ]

  if (blockedSources.some((blocked) => source.includes(blocked))) return false

  const skipPatterns = [
    /india\s+(news|tech|business)/i,
    /mumbai|delhi|bangalore|hyderabad|pune/i,
    /indian\s+(startup|company|tech)/i,
    /watch this/i,
    /you wont believe/i,
    /shocking/i,
    /recipe/i,
    /makeup/i,
    /celebrity gossip/i,
    /horoscope/i,
    /lottery/i,
    /astrology/i,
  ]

  if (skipPatterns.some((pattern) => pattern.test(text))) return false

  if (!article.description || article.description.length < 20) return false

  return true
}

function detectRegion(title: string, description: string): "global" | "africa" | "nigeria" {
  const text = (title + " " + description).toLowerCase()

  if (text.includes("nigeria") || text.includes("lagos") || text.includes("abuja")) return "nigeria"
  if (
    text.includes("africa") ||
    text.includes("kenya") ||
    text.includes("ghana") ||
    text.includes("south africa") ||
    text.includes("uganda")
  )
    return "africa"

  return "global"
}

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
    date: new Date().toISOString(),
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
    date: new Date(Date.now() - 86400000).toISOString(),
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
    date: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: "/african-tech-summit.jpg",
    link: "https://dailytrust.com.ng",
    credibility: 0.87,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, region, sentiment } = body

    const allArticles: any[] = []

    if (NEWSAPI_KEY) {
      const nigerianQueries = [
        "Nigeria tech startup",
        "Lagos innovation hub",
        "Nigerian fintech",
        "Africa software development",
        "Nigeria AI artificial intelligence",
      ]

      for (const query of nigerianQueries) {
        try {
          const params = new URLSearchParams({
            q: query,
            language: "en",
            sortBy: "publishedAt",
            pageSize: "30",
            apiKey: NEWSAPI_KEY,
          })

          const response = await fetch(`${NEWSAPI_URL}/everything?${params.toString()}`)

          if (response.ok) {
            const data = await response.json()
            if (data.articles && Array.isArray(data.articles)) {
              allArticles.push(...data.articles)
            }
          } else {
            console.log("[v0] NewsAPI returned status:", response.status)
          }
        } catch (e) {
          console.log("[v0] NewsAPI query failed for:", query, e instanceof Error ? e.message : String(e))
        }
      }
    } else {
      console.log("[v0] NEWSAPI_KEY not set, using fallback articles")
    }

    if (allArticles.length === 0) {
      console.log("[v0] No articles from NewsAPI, using fallback data")
      allArticles.push(...fallbackArticles)
    }

    const articles = allArticles
      .filter(isQualityArticle)
      .map((article: any, index: number) => ({
        id: article.id || `${index}-${Date.now()}`,
        title: article.title,
        description: article.description || article.content || "",
        source: article.source?.name || "News",
        category: detectCategory(article.title, article.description || ""),
        sentiment: detectSentiment(article.title, article.description || ""),
        region: detectRegion(article.title, article.description || ""),
        date: article.publishedAt || article.date || new Date().toISOString(),
        imageUrl: article.urlToImage || article.imageUrl || "/placeholder.svg?height=200&width=400",
        link: article.url || article.link,
        credibility: 0.85,
      }))
      .filter((article, index, self) => self.findIndex((a) => a.title === article.title) === index)
      .slice(0, 60)

    let filtered = articles
    if (sentiment && sentiment !== "all") {
      filtered = filtered.filter((article) => article.sentiment === sentiment)
    }

    console.log("[v0] Returning", filtered.length, "articles")
    return NextResponse.json(filtered)
  } catch (error) {
    console.error("[v0] News API error:", error)
    return NextResponse.json(fallbackArticles)
  }
}
