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
    name: "ThisDay",
    url: "https://www.thisdaylive.com",
    selectors: {
      article: "article, .td-module-container",
      title: "h2, h3, .entry-title a",
      description: ".story-text, p, .td-excerpt",
      link: "a",
      date: ".story-date, time, .td-post-date",
      image: "img, .entry-thumb",
    },
  },
  {
    name: "Punch Nigeria",
    url: "https://punchng.com",
    selectors: {
      article: "article, .entry-item-simple, .feature-article",
      title: "h2 a, h3 a, .post-title a, .entry-title a",
      description: ".excerpt, p, .post-excerpt, .entry-excerpt",
      link: "a",
      date: ".date, time, .post-date, .entry-date",
      image: ".article-image-container img, .post-image img, .entry-image img, img",
    },
  },
  {
    name: "The Cable",
    url: "https://www.thecable.ng",
    selectors: {
      article: "article, .story, .td_module_10",
      title: "h2 a, h3 a, .entry-title a",
      description: ".story-summary, p, .td-excerpt",
      link: "a",
      date: ".story-time, time, .td-post-date",
      image: ".story-image img, img, .entry-thumb",
    },
  },
  {
    name: "Information Nigeria",
    url: "https://www.informationng.com",
    selectors: {
      article: "article, .td_module_wrap, .td-block-span6",
      title: "h2 a, h3 a, .jeg_post_title a, .entry-title a",
      description: ".post-excerpt, p, .jeg_post_excerpt p, .td-excerpt",
      link: "a",
      date: ".post-date, time, .jeg_meta_date, .td-post-date",
      image: ".td-image-wrap span, .td-thumb-css, img, .jeg_thumb img",
    },
  },
  {
    name: "TechCabal",
    url: "https://techcabal.com",
    selectors: {
      article: "article, .article-card",
      title: "h2 a, h1 a, .entry-title a",
      description: ".article-excerpt, p, .entry-content p",
      link: "a",
      date: ".publish-date, time",
      image: ".article-image img, img, .attachment-medium",
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
  }
]

async function run() {
  console.log("Starting all working sources test...")

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

      const unique = list.filter((a, idx, self) => self.findIndex((x) => x.title === a.title) === idx)
      console.log(`[${src.name}] Scraped ${unique.length} unique articles! (with desc >= 20: ${unique.filter(x => x.description.length >= 20).length})`)
    } catch (e: any) {
      console.log(`[${src.name}] Error: ${e.message}`)
    }
  }
}

run()
