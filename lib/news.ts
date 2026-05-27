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
    if (text.match(/\b(tech|software|ai|startup|digital|app|apps|crypto|fintech)\b/)) return "technology"
    if (text.match(/\b(business|market|trade|economy|finance)\b/)) return "business"
    if (text.match(/\b(government|politics|election|policy)\b/)) return "politics"
    if (text.match(/\b(culture|film|music|entertainment|fashion)\b/)) return "culture"
    if (text.match(/\b(science|research|energy|health)\b/)) return "science"
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

// ✅ Validate article quality (lenient on descriptions, using smart fallbacks instead of discarding)
function isQualityArticle(article: any): boolean {
    if (!article.title) return false
    const source = (article.source || "").toLowerCase()
    const blockedSources = ["reddit", "quora", "gossip", "medium", "tabloid"]
    if (blockedSources.some((blocked) => source.includes(blocked))) return false
    return true
}

export const SOURCE_BIAS: Record<string, "government-aligned" | "opposition-leaning" | "independent" | "neutral"> = {
  "The Nation": "government-aligned",
  "News Agency of Nigeria": "government-aligned",
  "Daily Trust": "opposition-leaning",
  "Premium Times": "independent",
  "The Cable": "independent",
  "TechCabal": "independent",
  "Punch Nigeria": "neutral",
  "ThisDay": "neutral",
  "Information Nigeria": "neutral",
  "Vanguard Nigeria": "neutral",
}

// 🧠 Title keyword Jaccard similarity helper for story clustering
function getSignificantWords(title: string): Set<string> {
    const stopwords = new Set([
        "the", "a", "an", "and", "in", "of", "to", "for", "on", "at", "with", "by", "from", "is", "was", "has", "have", "are", "that", "this", "it", 
        "says", "urges", "calls", "amid", "over", "as", "after", "about", "who", "whom", "whose", "why", "how", "what", "where", "when"
    ])
    return new Set(
        title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopwords.has(w))
    )
}

function areSimilar(title1: string, title2: string): boolean {
    const words1 = getSignificantWords(title1)
    const words2 = getSignificantWords(title2)
    if (words1.size === 0 || words2.size === 0) return false
    
    let intersection = 0
    for (const w of words1) {
        if (words2.has(w)) intersection++
    }
    
    const union = words1.size + words2.size - intersection
    const jaccard = intersection / union
    
    return jaccard >= 0.18 || intersection >= 3
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
        imageUrl: "/Group728.png",
        link: "https://techcabal.com",
        credibility: 0.9,
        articles: [],
        coverageCount: 1,
        biasDistribution: { government: 0, opposition: 0, independent: 1, neutral: 0 }
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
            let categories = category !== "all" ? category : "sports,business,technology"
            const url = `${MEDIASTACK_URL}?access_key=${MEDIASTACK_API_KEY}${countries ? `&countries=${countries}` : ""}${categories ? `&categories=${categories}` : ""}&languages=en&limit=50&sort=published_desc`
            
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)
            const response = await fetch(url, { signal: controller.signal })
            clearTimeout(timeoutId)
            if (response.ok) {
                const data = await response.json()
                if (data.data) {
                    allArticles.push(...data.data.map((a: any) => ({
                        ...a,
                        region: countries === "ng" ? "nigeria" : undefined
                    })))
                }
            }
        } catch (e) {
            console.error("[news-service] Mediastack failed:", e)
        }
    }

    // Transform raw articles
    const transformedArticles = allArticles
        .filter(isQualityArticle)
        .map((article: any, index: number) => {
            const mappedTitle = article.title || ""
            let mappedDesc = article.description || ""
            if (!mappedDesc || mappedDesc.length < 20) {
                mappedDesc = `Read the full, detailed coverage of this story from ${article.source || "independent sources"}. Get multiple angles, compare coverage framing, and remain well-informed.`
            }
            const source = article.source || "Unknown"
            const bias = SOURCE_BIAS[source] || "neutral"

            return {
                id: article.id || `${index}-${Date.now()}`,
                title: mappedTitle,
                description: mappedDesc,
                source: source,
                category: detectCategory(mappedTitle, mappedDesc),
                sentiment: detectSentiment(mappedTitle, mappedDesc),
                region: article.region || detectRegion(mappedTitle, mappedDesc),
                date: article.published_at || article.date || new Date().toISOString(),
                imageUrl: article.image || article.imageUrl || "/Group728.png",
                link: article.url || article.link || "#",
                credibility: 0.85,
                bias: bias,
            }
        })
        .filter((article, index, self) => self.findIndex((a) => a.title === article.title) === index)

    // Group similar articles into Stories (Ground News style clustering)
    const stories: any[] = []
    
    for (const article of transformedArticles) {
        let matchedStory = stories.find(s => areSimilar(s.title, article.title))
        
        if (matchedStory) {
            matchedStory.articles.push(article)
            matchedStory.coverageCount = matchedStory.articles.length
            
            const distribution = { government: 0, opposition: 0, independent: 0, neutral: 0 }
            matchedStory.articles.forEach((a: any) => {
                if (a.bias === "government-aligned") distribution.government++
                else if (a.bias === "opposition-leaning") distribution.opposition++
                else if (a.bias === "independent") distribution.independent++
                else distribution.neutral++
            })
            matchedStory.biasDistribution = distribution

            if (matchedStory.imageUrl === "/Group728.png" && article.imageUrl !== "/Group728.png") {
                matchedStory.imageUrl = article.imageUrl
            }
        } else {
            const distribution = { government: 0, opposition: 0, independent: 0, neutral: 0 }
            if (article.bias === "government-aligned") distribution.government++
            else if (article.bias === "opposition-leaning") distribution.opposition++
            else if (article.bias === "independent") distribution.independent++
            else distribution.neutral++

            stories.push({
                id: `story-${article.id}`,
                title: article.title,
                description: article.description,
                source: article.source,
                category: article.category,
                sentiment: article.sentiment,
                region: article.region,
                date: article.date,
                imageUrl: article.imageUrl,
                link: article.link,
                credibility: article.credibility,
                articles: [article],
                coverageCount: 1,
                biasDistribution: distribution
            })
        }
    }

    // Sort stories: stories covered by more sources appear first
    stories.sort((a, b) => b.coverageCount - a.coverageCount)

    // Filtering by Metadata if requested
    let filtered = stories
    if (region !== "all") filtered = filtered.filter(a => a.region === region)
    if (sentiment !== "all") filtered = filtered.filter(a => a.sentiment === sentiment)
    if (category !== "all") filtered = filtered.filter(a => a.category === category)

    // Time Filtering
    const now = new Date()
    if (timeRange === "today") {
        const thirtySixHoursAgo = now.getTime() - (36 * 60 * 60 * 1000)
        let timeFiltered = filtered.filter(a => new Date(a.date).getTime() >= thirtySixHoursAgo)

        if (timeFiltered.length < 10) {
            console.log(`[news-service] Only ${timeFiltered.length} stories in 36h. Expanding window.`)
            const fortyEightHoursAgo = now.getTime() - (48 * 60 * 60 * 1000)
            timeFiltered = filtered.filter(a => new Date(a.date).getTime() >= fortyEightHoursAgo)
        }

        if (timeFiltered.length === 0) {
            console.log("[news-service] No stories found after time filter, using fallback.")
            return fallbackArticles
        }

        filtered = timeFiltered
    }

    if (filtered.length === 0) return fallbackArticles

    return filtered.slice(0, 50)
}
