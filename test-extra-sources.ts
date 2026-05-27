async function testFetch(name: string, url: string) {
    console.log(`\n--- Testing ${name} (${url}) ---`)
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
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
            const html = await response.text()
            console.log(`Successfully loaded ${html.length} chars.`)
        }
    } catch (e: any) {
        console.log(`Failed: ${e.message}`)
    }
}

async function run() {
    await testFetch("Premium Times", "https://www.premiumtimesng.com")
    await testFetch("Daily Post Nigeria", "https://dailypost.ng")
    await testFetch("The Nation Newspaper", "https://thenationonlineng.net")
}

run()
