import * as cheerio from "cheerio"

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
      article: "article.post-item, .jeg_post",
      title: "h3 a, h2 a, .jeg_post_title a",
      description: ".post-excerpt, p, .jeg_post_excerpt p",
      link: "a",
      date: ".post-date, time, .jeg_meta_date",
      image: "img, .jeg_thumb img",
    },
  },
  {
    name: "Punch Nigeria",
    url: "https://punchng.com",
    selectors: {
      article: "article, .post-item-list",
      title: "h2 a, h3 a, .post-title a",
      description: ".excerpt, p, .post-excerpt",
      link: "a",
      date: ".date, time, .post-date",
      image: "img, .post-image img",
    },
  },
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
    name: "Vanguard Nigeria",
    url: "https://www.vanguardngr.com",
    selectors: {
      article: "article, .rt-news-box-item",
      title: "h2 a, h3 a, .entry-title a",
      description: ".story-text, p, .rt-news-box-content p",
      link: "a",
      date: ".time, time",
      image: "img, .rt-news-box-img img",
    },
  },
]

export async function scrapeNigerianNews(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled(
    nigerianSources.map(async (source) => {
      try {
        const response = await fetch(source.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        if (!response.ok) {
          console.log(`[scraper] ${source.name} returned status ${response.status}`)
          return []
        }

        const html = await response.text()
        const $ = cheerio.load(html)
        const sourceArticles: ScrapedArticle[] = []

        $(source.selectors.article).each((_, element) => {
          try {
            const article = $(element)
            const titleEl = article.find(source.selectors.title).first()
            const descEl = article.find(source.selectors.description).first()
            const linkEl = article.find(source.selectors.link).first()
            const dateEl = article.find(source.selectors.date).first()
            const imageEl = source.selectors.image ? article.find(source.selectors.image).first() : null

            const title = titleEl.text().trim()
            const link = linkEl.attr("href") || ""

            if (title && link) {
              const description = descEl.text().trim() || ""

              // Resilient date parsing
              let rawDate = dateEl.text().trim() || ""
              let date = new Date().toISOString()
              if (rawDate) {
                const parsed = new Date(rawDate)
                if (!isNaN(parsed.getTime())) {
                  date = parsed.toISOString()
                }
              }

              // Enhanced Image Extraction (src, data-src, srcset)
              let imageUrl = undefined
              if (imageEl) {
                imageUrl = imageEl.attr("src") || imageEl.attr("data-src") || imageEl.attr("data-original")

                // Handle srcset if needed (take the first URL)
                if (!imageUrl && imageEl.attr("srcset")) {
                  const srcset = imageEl.attr("srcset") || ""
                  imageUrl = srcset.split(",")[0].trim().split(" ")[0]
                }
              }

              if (imageUrl && !imageUrl.startsWith("http")) {
                // Check if it's a protocol-relative URL
                if (imageUrl.startsWith("//")) {
                  imageUrl = "https:" + imageUrl
                } else {
                  try {
                    imageUrl = new URL(imageUrl, source.url).toString()
                  } catch (e) {
                    imageUrl = undefined
                  }
                }
              }

              if (title.length > 10) {
                sourceArticles.push({
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
          }
        })

        console.log(`[scraper] Scraped ${sourceArticles.length} articles from ${source.name}`)
        return sourceArticles.slice(0, 30) // Increased limit to provide more variety for filtering
      } catch (error) {
        console.log(`[scraper] Error for ${source.name}:`, error instanceof Error ? error.message : String(error))
        return []
      }
    })
  )

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
}
