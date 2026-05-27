async function testFeed(name: string, url: string) {
    console.log(`\n--- Testing ${name} (${url}) ---`)
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        const response = await fetch(url, {
            headers,
            signal: controller.signal,
        })
        clearTimeout(timeoutId)
        console.log(`Status: ${response.status} ${response.statusText}`)
        if (response.ok) {
            const xml = await response.text()
            console.log(`Successfully loaded feed. Length: ${xml.length} chars.`)
            console.log("Feed Snippet:")
            console.log(xml.slice(0, 500))
        }
    } catch (e: any) {
        console.log(`Failed: ${e.message}`)
    }
}

async function run() {
    await testFeed("Vanguard RSS", "https://www.vanguardngr.com/feed")
}

run()
