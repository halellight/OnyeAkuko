import * as cheerio from "cheerio"

async function debugHTML(name: string, url: string) {
    console.log(`\n=================================`)
    console.log(`DEBUGGING ${name} HTML...`)
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    try {
        const response = await fetch(url, { headers })
        const html = await response.text()
        const $ = cheerio.load(html)

        console.log(`Page length: ${html.length}`)
        console.log(`Title: "${$("title").text().trim()}"`)

        // Find some tags
        const tags = ["article", ".jeg_post", ".mvp-blog-story", "h2", "h3", ".post", "a"]
        for (const t of tags) {
            const count = $(t).length
            console.log(`Selector '${t}' matches: ${count} elements`)
        }

        // Print some link elements
        console.log("\nSome 'a' tags with text and href:")
        let count = 0
        $("a").each((_, el) => {
            const a = $(el)
            const text = a.text().trim()
            const href = a.attr("href") || ""
            if (href.startsWith("http") && text.length > 15 && count < 8) {
                console.log(`- "${text}": ${href}`)
                count++
            }
        })
    } catch (e: any) {
        console.log(`Error: ${e.message}`)
    }
}

async function run() {
    await debugHTML("Daily Trust", "https://dailytrust.com")
    await debugHTML("The Nation", "https://thenationonlineng.net")
    await debugHTML("Daily Post", "https://dailypost.ng")
}

run()
