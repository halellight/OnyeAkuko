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

export function parseRelativeDate(dateStr: string): Date {
  const now = new Date()
  const trimmed = dateStr.toLowerCase().trim()
  
  if (!trimmed) return now
  
  if (trimmed.includes("just now") || trimmed.includes("seconds ago")) {
    return now
  }
  
  // Match "X mins ago", "X min ago", "X minutes ago"
  const minMatch = trimmed.match(/(\d+)\s*min/i)
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10)
    return new Date(now.getTime() - mins * 60 * 1000)
  }
  
  // Match "X hours ago", "X hour ago", "X hr ago", "X hrs ago"
  const hourMatch = trimmed.match(/(\d+)\s*(hour|hr)/i)
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10)
    return new Date(now.getTime() - hours * 60 * 60 * 1000)
  }
  
  // Match "X days ago", "X day ago"
  const dayMatch = trimmed.match(/(\d+)\s*day/i)
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10)
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }

  // Match "X weeks ago", "X week ago"
  const weekMatch = trimmed.match(/(\d+)\s*week/i)
  if (weekMatch) {
    const weeks = parseInt(weekMatch[1], 10)
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
  }
  
  // Match "yesterday"
  if (trimmed.includes("yesterday")) {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }
  
  // Fallback to standard Date parsing
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }
  
  return now
}

export async function scrapeNigerianNews(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled(
    nigerianSources.map(async (source) => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased to 15s for slower connections
        
        const response = await fetch(source.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

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
            
            // Refined resilient title finder
            let titleEl = article.find(source.selectors.title).first()
            if (titleEl.length === 0 && (source.selectors.title === "a" || source.selectors.title.includes("a"))) {
              if (article.is("a")) titleEl = article
              else if (article.is("h2") || article.is("h3")) titleEl = article.find("a").first()
            }

            const title = titleEl.text().trim()
            
            // Refined resilient link finder
            let link = titleEl.attr("href") || ""
            if (!link && article.is("a")) link = article.attr("href") || ""
            if (!link) {
              const firstA = article.find("a").first()
              link = firstA.attr("href") || ""
            }

            if (title && link) {
              const descEl = article.find(source.selectors.description).first()
              const description = descEl.text().trim() || ""

              const dateEl = article.find(source.selectors.date).first()
              let rawDate = dateEl.text().trim() || ""
              let date = parseRelativeDate(rawDate).toISOString()

              // Enhanced Image Extraction
              const imageEl = source.selectors.image ? article.find(source.selectors.image).first() : null
              let imageUrl = undefined
              if (imageEl) {
                imageUrl = imageEl.attr("data-src") || imageEl.attr("data-original") || imageEl.attr("data-lazy-src") || imageEl.attr("src")

                if (!imageUrl || imageUrl.includes("data:image")) {
                  const style = imageEl.attr("style") || ""
                  const bgMatch = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/)
                  if (bgMatch) imageUrl = bgMatch[2]
                }

                if ((!imageUrl || imageUrl.includes("data:image")) && imageEl.attr("srcset")) {
                  const srcset = imageEl.attr("srcset") || ""
                  imageUrl = srcset.split(",")[0].trim().split(" ")[0]
                }

                if (imageUrl) {
                  const lowers = imageUrl.toLowerCase()
                  if (lowers.includes("logo") || lowers.includes("icon") || lowers.includes("placeholder") || lowers.includes("jeg-empty")) {
                    imageUrl = undefined
                  }
                }
              }

              if (imageUrl && !imageUrl.startsWith("http")) {
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
        return sourceArticles.slice(0, 30) // Limit to provide more variety for filtering
      } catch (error) {
        console.log(`[scraper] Error for ${source.name}:`, error instanceof Error ? error.message : String(error))
        return []
      }
    })
  )

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
}
