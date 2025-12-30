import { scrapeNigerianNews } from "./lib/news-scraper.ts"

async function test() {
    console.log("Starting test scrape...")
    const articles = await scrapeNigerianNews()
    console.log(`Found ${articles.length} articles`)
    if (articles.length > 0) {
        console.log("First article:", articles[0].title)
    }
}

test()
