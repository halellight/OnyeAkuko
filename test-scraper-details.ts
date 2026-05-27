import { scrapeNigerianNews } from "./lib/news-scraper.ts"

function isQualityArticle(article: any): boolean {
    if (!article.title || !article.description) return false
    if (article.description.length < 20) return false
    const source = (article.source || "").toLowerCase()
    const blockedSources = ["reddit", "quora", "gossip", "medium", "tabloid"]
    if (blockedSources.some((blocked) => source.includes(blocked))) return false
    return true
}

async function test() {
    console.log("=== SCRAPER FILTER TEST ===")
    const articles = await scrapeNigerianNews()
    console.log(`Scraper returned ${articles.length} articles total.`)

    const sourceStats: Record<string, { total: number, hasDesc: number, descLen: number[], passed: number }> = {}

    for (const a of articles) {
        if (!sourceStats[a.source]) {
            sourceStats[a.source] = { total: 0, hasDesc: 0, descLen: [], passed: 0 }
        }
        const stats = sourceStats[a.source]
        stats.total++
        if (a.description) {
            stats.hasDesc++
            stats.descLen.push(a.description.length)
        }
        if (isQualityArticle(a)) {
            stats.passed++
        }
    }

    console.log("Stats per source:")
    console.log(JSON.stringify(sourceStats, null, 2))

    // Let's print some sample failed ones
    console.log("\n=== SAMPLE ARTICLES (First 10) ===")
    articles.slice(0, 10).forEach((a, i) => {
        console.log(`[${i+1}] Source: ${a.source}`)
        console.log(`    Title: "${a.title}"`)
        console.log(`    Desc: "${a.description}" (Len: ${a.description?.length || 0})`)
        console.log(`    Passed isQualityArticle: ${isQualityArticle(a)}`)
    })
}

test()
