import * as cheerio from "cheerio"

async function testScrape(name: string, url: string, selectors: any) {
    console.log(`\n=======================`)
    console.log(`SCRAPING ${name} (${url})...`)
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 12000)
        const response = await fetch(url, { headers, signal: controller.signal })
        clearTimeout(timeoutId)
        if (!response.ok) {
            console.log(`Failed with status ${response.status}`)
            return
        }

        const html = await response.text()
        const $ = cheerio.load(html)
        const articles: any[] = []

        $(selectors.article).each((_, element) => {
            const article = $(element)
            const titleEl = article.find(selectors.title).first()
            const descEl = selectors.description ? article.find(selectors.description).first() : null
            const linkEl = article.find(selectors.link).first()
            const dateEl = selectors.date ? article.find(selectors.date).first() : null
            const imageEl = selectors.image ? article.find(selectors.image).first() : null

            const title = titleEl.text().trim()
            const link = linkEl.attr("href") || ""
            const description = descEl ? descEl.text().trim() : ""
            const date = dateEl ? dateEl.text().trim() : ""
            
            let imageUrl = ""
            if (imageEl) {
                imageUrl = imageEl.attr("data-src") || imageEl.attr("data-original") || imageEl.attr("data-lazy-src") || imageEl.attr("src") || ""
            }

            if (title && link) {
                articles.push({ title, link, description, date, imageUrl })
            }
        })

        console.log(`Successfully scraped ${articles.length} articles!`)
        if (articles.length > 0) {
            console.log("First 3 articles:")
            articles.slice(0, 3).forEach((a, i) => {
                console.log(`[${i+1}] Title: "${a.title}"`)
                console.log(`    Link: "${a.link}"`)
                console.log(`    Description: "${a.description.slice(0, 100)}..." (Len: ${a.description.length})`)
                console.log(`    Date: "${a.date}"`)
                console.log(`    Image: "${a.imageUrl.slice(0, 80)}..."`)
            })
        }
    } catch (e: any) {
        console.log(`Error scraping: ${e.message}`)
    }
}

async function run() {
    // 1. Daily Trust (Corrected URL and selectors)
    await testScrape("Daily Trust", "https://dailytrust.com", {
        article: ".jeg_post, article",
        title: ".jeg_post_title a, h3 a",
        description: ".jeg_post_excerpt p, p",
        link: "a",
        date: ".jeg_meta_date, time",
        image: ".jeg_thumb img, img",
    })

    // 2. The Nation Newspaper (Government-Aligned)
    await testScrape("The Nation", "https://thenationonlineng.net", {
        article: "article, .mvp-blog-story, .mvp-widget-feat",
        title: "h2 a, h3 a, h1 a, .mvp-blog-story-title a",
        description: "p, .mvp-blog-story-excerpt",
        link: "a",
        date: "time, .mvp-blog-story-date",
        image: "img",
    })

    // 3. Premium Times (Independent Investigative)
    await testScrape("Premium Times", "https://www.premiumtimesng.com", {
        article: ".story-card, article, .jeg_post",
        title: "h3 a, h2 a, .jeg_post_title a",
        description: "p, .jeg_post_excerpt",
        link: "a",
        date: "time, .jeg_meta_date",
        image: "img",
    })

    // 4. Daily Post (Mainstream)
    await testScrape("Daily Post", "https://dailypost.ng", {
        article: "article, .mvp-blog-story",
        title: "h2 a, h3 a, .mvp-blog-story-title a",
        description: "p",
        link: "a",
        date: "time",
        image: "img",
    })
}

run()
