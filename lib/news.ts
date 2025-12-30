import { scrapeNigerianNews } from "./news-scraper"

const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY
const MEDIASTACK_URL = "https://api.mediastack.com/v1/news"

export interface NewsOptions {
    category?: string
    region?: string
    sentiment?: string
    timeRange?: string
}

// 🧠 Sentiment Detection
function detectSentiment(title: string, description: string): "positive" | "negative" | "neutral" {
    const text = (title + " " + description).toLowerCase()
    const positiveWords = ["growth", "success", "achieve", "improve", "advance", "boost", "surge", "record", "gain", "profit", "launch", "innovation", "investment", "partnership"]
    const negativeWords = ["decline", "loss", "crisis", "drop", "fail", "worse", "concern", "risk", "threat", "attack", "bankruptcy", "layoff", "controversy"]
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
    // Improved detection with more keywords
    if (text.includes("nigeria") || text.includes("lagos") || text.includes("abuja") || text.includes("kano") || text.includes("port harcourt") || text.includes("tinubu") || text.includes("naira") || text.includes("fg") || text.includes("inec")) return "nigeria"
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

export const fallbackArticles = [
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
    }
]

export async function getNews(options: NewsOptions = {}) {
    const { category = "all", region = "all", sentiment = "all", timeRange = "today" } = options

    const allArticles: any[] = []
    console.log(`[news-service] Fetching news: Category=${category}, Region=${region}, TimeRange=${timeRange}`)

    // 🇳🇬 Scraper
    try {
        const scraped = await scrapeNigerianNews()
        if (scraped && scraped.length > 0) {
            allArticles.push(...scraped.map(s => ({
                ...s,
                id: `scraped-${Math.random().toString(36).substr(2, 9)}`,
                published_at: s.date,
                // If it comes from our Nigerian scraper, it's definitely Nigerian news
                region: "nigeria"
            })))
        }
    } catch (e) {
        console.error("[news-service] Scraper failed:", e)
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
                if (data.data) {
                    allArticles.push(...data.data.map((a: any) => ({
                        ...a,
                        // If we specifically requested Nigeria from Mediastack, tag it as such
                        region: countries === "ng" ? "nigeria" : undefined
                    })))
                }
            }
        } catch (e) {
            console.error("[news-service] Mediastack failed:", e)
        }
    }

    // Transform & Filter
    const articles = allArticles
        .filter(isQualityArticle)
        .map((article: any, index: number) => {
            const mappedTitle = article.title || ""
            const mappedDesc = article.description || ""
            return {
                id: article.id || `${index}-${Date.now()}`,
                title: mappedTitle,
                description: mappedDesc,
                source: article.source || "Unknown",
                category: detectCategory(mappedTitle, mappedDesc),
                sentiment: detectSentiment(mappedTitle, mappedDesc),
                // Use pre-tagged region if available, otherwise detect
                region: article.region || detectRegion(mappedTitle, mappedDesc),
                date: article.published_at || article.date || new Date().toISOString(),
                imageUrl: article.image || article.imageUrl || "/nigerian-tech-startup.jpg",
                link: article.url || article.link || "#",
                credibility: 0.85,
            }
        })
        .filter((article, index, self) => self.findIndex((a) => a.title === article.title) === index)

    // Filtering by Metadata if requested
    let filtered = articles
    if (region !== "all") filtered = filtered.filter(a => a.region === region)
    if (sentiment !== "all") filtered = filtered.filter(a => a.sentiment === sentiment)
    if (category !== "all") filtered = filtered.filter(a => a.category === category)

    // Time Filtering
    const now = new Date()
    if (timeRange === "today") {
        const thirtySixHoursAgo = now.getTime() - (36 * 60 * 60 * 1000)
        let timeFiltered = filtered.filter(a => new Date(a.date).getTime() >= thirtySixHoursAgo)

        if (timeFiltered.length < 10) {
            console.log(`[news-service] Only ${timeFiltered.length} articles in 36h. Expanding window.`)
            const fortyEightHoursAgo = now.getTime() - (48 * 60 * 60 * 1000)
            timeFiltered = filtered.filter(a => new Date(a.date).getTime() >= fortyEightHoursAgo)
        }

        // Fallback if STILL empty after time filtering
        if (timeFiltered.length === 0) {
            console.log("[news-service] No articles found after time filter, using fallback.")
            return fallbackArticles
        }

        filtered = timeFiltered
    }

    if (filtered.length === 0) return fallbackArticles

    return filtered.slice(0, 50)
}
