import * as cheerio from "cheerio"

interface ScrapedArticle {
  title: string
  description: string
  source: string
  date: string
  link: string
  imageUrl?: string
}

const sources = [
  {
    name: "Daily Trust",
    url: "https://dailytrust.com",
    selectors: {
      article: ".jeg_post, article, .jeg_hero_item, div.jeg_block_container .jeg_post",
      title: ".jeg_post_title a, h3 a, h2 a",
      description: ".jeg_post_excerpt, p",
      link: "a",
      date: ".jeg_meta_date, time",
      image: ".jeg_thumb img, img",
    },
  },
  {
    name: "The Nation",
    url: "https://thenationonlineng.net",
    selectors: {
      article: "article, .mvp-blog-story, .mvp-widget-feat, .mvp-feat-area-text, h2",
      title: "a, h2 a, h3 a",
      link: "a",
      description: "p, .mvp-blog-story-excerpt",
      date: "time, .mvp-blog-story-date",
      image: "img",
    },
  },
  {
    name: "Premium Times",
    url: "https://www.premiumtimesng.com",
    selectors: {
      article: "article, .jeg_post, .story-card, div.jeg_block_container .jeg_post",
      title: ".jeg_post_title a, h3 a, h2 a",
      link: "a",
      description: "p, .jeg_post_excerpt",
      date: "time, .jeg_meta_date",
      image: "img",
    },
  },
  {
    name: "Daily Post",
    url: "https://dailypost.ng",
    selectors: {
      article: "article, .mvp-blog-story, .mvp-main-blog-story, div.mvp-blog-story-wrap",
      title: "h2 a, h3 a, h2, h3",
      link: "a",
      description: "p",
      date: "time",
      image: "img",
    },
  }
]

async function run() {
  console.log("Starting final selector test...")

  for (const src of sources) {
    try {
      const response = await fetch(src.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        }
      })

      if (!response.ok) {
        console.log(`[${src.name}] Status error: ${response.status}`)
        continue
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      const list: ScrapedArticle[] = []

      $(src.selectors.article).each((_, el) => {
        const art = $(el)
        let titleEl = art.find(src.selectors.title).first()
        if (titleEl.length === 0 && (src.selectors.title === "a" || src.selectors.title.includes("a"))) {
          if (art.is("a")) titleEl = art
          else if (art.is("h2") || art.is("h3")) titleEl = art.find("a").first()
        }

        const title = titleEl.text().trim()
        let link = titleEl.attr("href") || ""
        if (!link && art.is("a")) link = art.attr("href") || ""
        if (!link) {
          const firstA = art.find("a").first()
          link = firstA.attr("href") || ""
        }

        if (title && link && title.length > 15) {
          const descEl = art.find(src.selectors.description).first()
          const description = descEl.text().trim() || ""
          const dateEl = art.find(src.selectors.date).first()
          const date = dateEl.text().trim() || new Date().toISOString()
          const imgEl = art.find(src.selectors.image).first()
          const imageUrl = imgEl.attr("src") || imgEl.attr("data-src") || undefined

          list.push({
            title,
            description,
            source: src.name,
            date,
            link: link.startsWith("http") ? link : new URL(link, src.url).toString(),
            imageUrl,
          })
        }
      })

      // Filter out duplicate titles
      const unique = list.filter((a, idx, self) => self.findIndex((x) => x.title === a.title) === idx)

      console.log(`[${src.name}] Scraped ${unique.length} unique articles!`)
      if (unique.length > 0) {
        console.log("First 2 unique articles:")
        unique.slice(0, 2).forEach((a, i) => {
          console.log(`  [${i+1}] Title: "${a.title}"`)
          console.log(`      Link: "${a.link}"`)
          console.log(`      Desc Length: ${a.description.length} chars ("${a.description.slice(0, 80)}...")`)
          console.log(`      Date: "${a.date}"`)
          console.log(`      Image: "${a.imageUrl || 'none'}"`)
        })
      }
    } catch (e: any) {
      console.log(`[${src.name}] Error: ${e.message}`)
    }
  }
}

run()
