import * as cheerio from "cheerio"

async function testRobust(name: string, url: string) {
    console.log(`\n=== Testing Robust Selectors for ${name} ===`)
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    try {
        const response = await fetch(url, { headers })
        const html = await response.text()
        const $ = cheerio.load(html)
        const articles: any[] = []

        // Select all h2 or h3 elements
        $("h2, h3").each((_, el) => {
            const h = $(el)
            const a = h.find("a").first()
            if (a.length > 0) {
                const title = a.text().trim()
                const link = a.attr("href") || ""
                if (title.length > 15 && link.startsWith("http")) {
                    articles.push({ title, link })
                }
            }
        })

        console.log(`Found ${articles.length} articles!`)
        articles.slice(0, 5).forEach((a, i) => {
            console.log(`[${i+1}] Title: "${a.title}"`)
            console.log(`    Link: "${a.link}"`)
        })
    } catch (e: any) {
        console.log(`Error: ${e.message}`)
    }
}

async function run() {
    await testRobust("Daily Trust", "https://dailytrust.com")
    await testRobust("The Nation", "https://thenationonlineng.net")
    await testRobust("Daily Post", "https://dailypost.ng")
}

run()
