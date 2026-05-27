import * as cheerio from "cheerio"

async function testFetch(name: string, url: string) {
    console.log(`\n--- Testing ${name} (${url}) ---`)
    const headersList = [
        // Test 1: Standard Chrome Headers
        {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
        },
        // Test 2: Firefox User Agent
        {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }
    ]

    for (let i = 0; i < headersList.length; i++) {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)
            const response = await fetch(url, {
                headers: headersList[i],
                signal: controller.signal,
            })
            clearTimeout(timeoutId)
            console.log(`Test ${i+1} Status: ${response.status} ${response.statusText}`)
            if (response.ok) {
                const html = await response.text()
                const $ = cheerio.load(html)
                console.log(`Test ${i+1} successfully loaded ${html.length} chars. Title: "${$("title").text().trim()}"`)
                break
            }
        } catch (e: any) {
            console.log(`Test ${i+1} Failed: ${e.message}`)
        }
    }
}

async function run() {
    await testFetch("Vanguard Nigeria", "https://www.vanguardngr.com")
    await testFetch("Information Nigeria", "https://www.informationng.com")
    await testFetch("Daily Trust", "https://dailytrust.com")
    await testFetch("TechCabal", "https://techcabal.com")
}

run()
