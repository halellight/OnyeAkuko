import { JSDOM } from "jsdom"

interface ScrapedArticle {
  title: string
  description: string
  source: string
  date: string
  link: string
  imageUrl?: string
}

const nigerianSources = [
  {
    name: "Daily Trust",
    url: "https://www.dailytrust.com.ng",
    selectors: {
      article: "article.post-item",
      title: "h3 a, h2 a",
      description: ".post-excerpt, p",
      link: "a",
      date: ".post-date, time",
      image: "img",
    },
  },
  {
    name: "Punch Nigeria",
    url: "https://punchng.com",
    selectors: {
      article: "article, .post",
      title: "h2 a, h3 a",
      description: ".excerpt, p",
      link: "a",
      date: ".date, time",
      image: "img",
    },
  },
  {
    name: "ThisDay",
    url: "https://www.thisdaylive.com",
    selectors: {
      article: "article, .story-item",
      title: "h2, h3",
      description: ".story-text, p",
      link: "a",
      date: ".story-date, time",
      image: "img",
    },
  },
  {
    name: "TechCabal",
    url: "https://techcabal.com",
    selectors: {
      article: "article, .article-card",
      title: "h2 a, h1 a",
      description: ".article-excerpt, p",
      link: "a",
      date: ".publish-date, time",
      image: ".article-image img, img",
    },
  },
  {
    name: "The Cable",
    url: "https://www.thecable.ng",
    selectors: {
      article: "article, .story",
      title: "h2 a, h3 a",
      description: ".story-summary, p",
      link: "a",
      date: ".story-time, time",
      image: ".story-image img, img",
    },
  },
  {
    name: "Vanguard Nigeria",
    url: "https://www.vanguardngr.com",
    selectors: {
      article: "article, .story-item",
      title: "h2 a, h3 a",
      description: ".story-text, p",
      link: "a",
      date: ".time, time",
      image: "img",
    },
  },
]

export async function scrapeNigerianNews(): Promise<ScrapedArticle[]> {
  const allArticles: ScrapedArticle[] = []

  for (const source of nigerianSources) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.ok) {
        console.log(`[v0] Scraper: ${source.name} returned status ${response.status}`)
        continue
      }

      const html = await response.text()
      const dom = new JSDOM(html)
      const document = dom.window.document

      const articles = document.querySelectorAll(source.selectors.article)

      articles.forEach((article) => {
        try {
          const titleEl = article.querySelector(source.selectors.title)
          const descEl = article.querySelector(source.selectors.description)
          const linkEl = article.querySelector(source.selectors.link)
          const dateEl = article.querySelector(source.selectors.date)
          const imageEl = source.selectors.image ? article.querySelector(source.selectors.image) : null

          if (titleEl && linkEl) {
            const title = titleEl.textContent?.trim() || ""
            const description = descEl?.textContent?.trim() || ""
            const link = linkEl.getAttribute("href") || ""
            const date = dateEl?.textContent?.trim() || new Date().toISOString()

            let imageUrl = imageEl?.getAttribute("src") || imageEl?.getAttribute("data-src") || undefined
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = new URL(imageUrl, source.url).toString()
            }

            if (title && title.length > 10) {
              allArticles.push({
                title,
                description,
                source: source.name,
                date,
                link: link.startsWith("http") ? link : new URL(link, source.url).toString(),
                imageUrl,
              })
            }
          }
        } catch (e) {
          // Skip individual article errors
          console.log(`[v0] Scraper error processing article from ${source.name}`)
        }
      })

      console.log(`[v0] Scraped ${articles.length} articles from ${source.name}`)
    } catch (error) {
      console.log(`[v0] Scraper error for ${source.name}:`, error instanceof Error ? error.message : String(error))
    }
  }

  return allArticles
}
