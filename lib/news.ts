import { scrapeNigerianNews } from "./news-scraper"
import { supabaseAdmin } from "./supabase"

const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY
const MEDIASTACK_URL = "https://api.mediastack.com/v1/news"

export interface NewsOptions {
    category?: string
    region?: string
    sentiment?: string
    timeRange?: string
}

// 🧠 Sentiment Detection
export function detectSentiment(title: string, description: string): "positive" | "negative" | "neutral" {
    const text = (title + " " + description).toLowerCase()
    
    const positiveWords = [
        "growth", "success", "achieve", "improve", "advance", "boost", "surge", "record", "gain", "profit", 
        "launch", "innovation", "investment", "partnership", "award", "win", "victory", "celebrate", 
        "triumph", "development", "funding", "raised", "expand", "historic", "peace", "stability"
    ]
    
    const negativeWords = [
        "decline", "loss", "crisis", "drop", "fail", "worse", "concern", "risk", "threat", "attack", 
        "bankruptcy", "layoff", "controversy", "protest", "strike", "clash", "crash", "accuse", "arrest", 
        "killing", "dead", "fatal", "flood", "disaster", "inflation", "hike", "hardship", "kidnap", 
        "bandit", "terrorist", "corrupt"
    ]
    
    const positiveCount = positiveWords.filter((word) => text.includes(word)).length
    const negativeCount = negativeWords.filter((word) => text.includes(word)).length
    
    if (positiveCount > negativeCount + 1) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
}

// 🏷️ Category Detection (Strictly aligning to: politics, technology, culture, world)
export function detectCategory(title: string, description: string): string {
    const text = (title + " " + description).toLowerCase()
    
    // 1. TECHNOLOGY (Combined with Science/Health/Fintech/Startups)
    const techRegex = /\b(tech|technology|software|ai|artificial intelligence|startup|startups|digital|app|apps|crypto|cryptocurrency|bitcoin|fintech|telecom|telecomm|broadband|internet|cyber|hacking|developer|chips|silicon|computing|science|research|scientific|robotics|energy|vaccine|health|medical|disease|space|nasa|galaxy|clinical|dna|biology|physics)\b/
    
    // 2. POLITICS (Aligned with Government, INEC, Elections, Judicial, Military, Policy, Laws)
    const politicsRegex = /\b(politics|political|government|fg|federal government|inec|election|elections|tinubu|presidency|president|governor|governors|senate|senator|senators|minister|ministry|parliament|legislative|bill|law|laws|court|judge|judicial|verdict|supreme court|pdp|apc|lp|party|tribunal|policy|taxation|security|military|police|army|troops|boko haram|ndlea|efcc|corruption|protest|strike|nwc|apc|pdp|buhari|sanwo-olu|wike|fubara)\b/
    
    // 3. CULTURE (Entertainment, Music, Film, Movies, Arts, Nollywood, Sports, Lifestyle)
    const cultureRegex = /\b(culture|cultural|film|films|movie|movies|cinema|music|musical|song|album|afrobeats|nollywood|hollywood|grammy|wizkid|davido|burna|burnaboy|fashion|designer|fashionista|lifestyle|entertainment|arts|artist|museum|heritage|theater|celebrity|celebrities|sports|football|soccer|super eagles|olympics|stadium|champions league|premier league|chelsea|arsenal|manchester|afcon|trophy|festival|dance|cuisine|tourism|chef|guinness record)\b/

    // 4. BUSINESS/ECONOMY (Redirecting to politics or world)
    const economyRegex = /\b(business|market|trade|economy|economic|finance|financial|stock|stocks|shares|inflation|naira|exchange rate|cbn|bank|banking|investment|revenue|subsidy|fuel price|oil|gas|dangote|refinery|tariff|gdp|exports|imports|customs)\b/

    if (text.match(techRegex)) return "technology"
    if (text.match(politicsRegex)) return "politics"
    if (text.match(cultureRegex)) return "culture"

    if (text.match(economyRegex)) {
        if (text.match(/cbn|government|fg|subsidy|policy|tariff|dangote|refinery|tax|budget/i)) {
            return "politics"
        }
        return "world"
    }

    return "world"
}

// 🌍 Region Detection
export function detectRegion(title: string, description: string): "global" | "africa" | "nigeria" {
    const text = (title + " " + description).toLowerCase()
    
    const nigeriaKeywords = [
        "nigeria", "nigerian", "lagos", "abuja", "kano", "port harcourt", "tinubu", "naira", "fg", 
        "inec", "dangote", "wike", "fubara", "sanwo-olu", "nollywood", "afrobeats", "super eagles", 
        "efcc", "ndlea", "cbn", "nnpc", "asuu", "nlc", "tuc", "kaduna", "enugu", "ibadan", "benin", 
        "calabar", "jos", "maiduguri", "anambra", "rivers state", "oyo", "kwara"
    ]
    
    const africaKeywords = [
        "africa", "african", "kenya", "ghana", "south africa", "uganda", "rwanda", "ethiopia", "egypt", 
        "morocco", "senegal", "tunisia", "algeria", "cameroon", "ecowas", "african union", "au"
    ]

    const containsNigeria = nigeriaKeywords.some(keyword => text.includes(keyword))
    if (containsNigeria) return "nigeria"

    const containsAfrica = africaKeywords.some(keyword => text.includes(keyword))
    if (containsAfrica) return "africa"

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

let isScrapingInProgress = false

export async function getNews(options: NewsOptions = {}) {
    const { category = "all", region = "all", sentiment = "all", timeRange = "today" } = options

    const allArticles: any[] = []
    console.log(`[news-service] Fetching news: Category=${category}, Region=${region}, TimeRange=${timeRange}`)

    // 🗄️ Database-First Fetching from Supabase
    let dbArticles: any[] = []
    try {
        const { data, error } = await supabaseAdmin
            .from("articles")
            .select("*")
            .order("date", { ascending: false })
            .limit(200)

        if (error) {
            console.error("[news-service] Supabase query error:", error)
        } else if (data && data.length > 0) {
            dbArticles = data
            console.log(`[news-service] Successfully retrieved ${dbArticles.length} articles from Supabase`)
        }
    } catch (e) {
        console.error("[news-service] Supabase connection failed:", e)
    }

    // 🔄 Lazy Background Self-Healing Cache Scraper
    // Trigger if database is empty OR the most recent article was scraped more than 2 hours ago
    let shouldScrapeInBackground = false
    if (dbArticles.length === 0) {
        shouldScrapeInBackground = true
    } else {
        const latestArticleDate = new Date(dbArticles[0].date).getTime()
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000)
        if (latestArticleDate < twoHoursAgo) {
            shouldScrapeInBackground = true
            console.log(`[news-service] Cache is stale (Latest date: ${dbArticles[0].date}). Triggering background update...`)
        }
    }

    if (shouldScrapeInBackground && !isScrapingInProgress) {
        isScrapingInProgress = true
        const runBackgroundScrape = async () => {
            try {
                console.log("[news-service-lazy] Starting background self-healing news scraper run...")
                const scraped = await scrapeNigerianNews()
                if (scraped.length === 0) {
                    console.log("[news-service-lazy] Background scraper yielded 0 articles.")
                    return
                }

                const mappedArticles = scraped.map((s) => {
                    const title = s.title || ""
                    let description = s.description || ""
                    if (!description || description.length < 20) {
                        description = `Read the full, detailed coverage of this story from ${s.source || "independent sources"}. Get multiple angles, compare coverage framing, and remain well-informed.`
                    }

                    return {
                        title: title,
                        description: description,
                        source: s.source,
                        category: detectCategory(title, description),
                        sentiment: detectSentiment(title, description),
                        region: detectRegion(title, description),
                        date: s.date || new Date().toISOString(),
                        image_url: s.imageUrl || "/Group728.png",
                        link: s.link || "#",
                        credibility: 0.85
                    }
                })

                // Filter out duplicate titles
                const uniqueMappedArticles = mappedArticles.filter(
                    (article, index, self) => self.findIndex((a) => a.title.trim() === article.title.trim()) === index
                )

                console.log(`[news-service-lazy] Upserting ${uniqueMappedArticles.length} unique background articles into Supabase...`)
                const { error } = await supabaseAdmin
                    .from("articles")
                    .upsert(uniqueMappedArticles, { onConflict: "title" })

                if (error) {
                    console.error("[news-service-lazy] Background database upsert failed:", error)
                } else {
                    console.log("[news-service-lazy] Background self-healing scraper successfully updated cache!")
                }
            } catch (e) {
                console.error("[news-service-lazy] Background self-healing scraper error:", e)
            } finally {
                isScrapingInProgress = false
            }
        }

        // Deploy background execution via Next.js 15/16 waitUntil or fire-and-forget
        try {
            const { waitUntil } = require("next/server")
            if (typeof waitUntil === "function") {
                waitUntil(runBackgroundScrape())
            } else {
                runBackgroundScrape()
            }
        } catch (e) {
            runBackgroundScrape()
        }
    }

    if (dbArticles.length > 0) {
        // Map database records to the frontend structure
        allArticles.push(...dbArticles.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            source: a.source,
            category: a.category,
            sentiment: a.sentiment,
            region: a.region,
            date: a.date,
            imageUrl: a.image_url || "/Group728.png",
            link: a.link,
            credibility: a.credibility || 0.85,
            bias: SOURCE_BIAS[a.source] || "neutral"
        })))
    } else {
        console.log("[news-service] Database is empty or unreachable. Falling back to live scraper and Mediastack...")
        // 🇳🇬 Live Scraper Fallback
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
            console.error("[news-service] Fallback Scraper failed:", e)
        }

        // 📡 Mediastack Fallback
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
                console.error("[news-service] Fallback Mediastack failed:", e)
            }
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
