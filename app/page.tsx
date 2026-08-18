"use client"

import { useState, useEffect } from "react"
import { NewsHeader } from "@/components/news-header"
import { NewsFilters } from "@/components/news-filters"
import { NewsGrid } from "@/components/news-grid"
import { ScrambleText } from "@/components/scramble-text"
import { HeroArticle } from "@/components/hero-article"
import { SidebarArticle } from "@/components/sidebar-article"
import { SportsScores } from "@/components/sports-scores"
import { NewsDietAnalyzer } from "@/components/news-diet-analyzer"
// import { HeadlineChecker } from "@/components/headline-checker"
import { NewsFooter } from "@/components/news-footer"

interface ClusteredArticle {
  id: string
  title: string
  description: string
  source: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  region: "global" | "africa" | "nigeria"
  date: string
  imageUrl: string
  link: string
  credibility: number
  bias: "government-aligned" | "opposition-leaning" | "independent" | "neutral"
}

interface Article {
  id: string
  title: string
  description: string
  source: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  region: "global" | "africa" | "nigeria"
  date: string
  imageUrl: string
  link: string
  credibility: number
  articles?: ClusteredArticle[]
  coverageCount?: number
  biasDistribution?: {
    government: number
    opposition: number
    independent: number
    neutral: number
  }
}

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("today")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          category: selectedCategory,
          region: selectedRegion,
          sentiment: selectedSentiment,
          timeRange: timeRange
        })
        const response = await fetch(`/api/news?${params.toString()}&_t=${Date.now()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        const data = await response.json()

        if (Array.isArray(data)) {
          setArticles(data)
        } else {
          console.error("API returned non-array:", data)
          setArticles([])
        }
      } catch (error) {
        console.error("Failed to load articles:", error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [selectedCategory, selectedRegion, selectedSentiment, timeRange])

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
      // 🇳🇬 Nigeria Filter Match (handles both regional classification and category fallback)
      if (selectedCategory === "nigeria") {
        if (article.region !== "nigeria" && article.category !== "nigeria") return false
      } else if (selectedCategory !== "all" && article.category !== selectedCategory) {
        return false
      }
      if (selectedRegion !== "all" && article.region !== selectedRegion) return false
      if (selectedSentiment !== "all" && article.sentiment !== selectedSentiment) return false

      // 🔍 Real-time Search Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = (article.title || "").toLowerCase().includes(query)
        const matchDesc = (article.description || "").toLowerCase().includes(query)
        const matchSource = (article.source || "").toLowerCase().includes(query)
        const matchCategory = (article.category || "").toLowerCase().includes(query)
        const matchSubArticles = article.articles?.some((sub) =>
          (sub.title || "").toLowerCase().includes(query) ||
          (sub.source || "").toLowerCase().includes(query)
        )

        if (!matchTitle && !matchDesc && !matchSource && !matchCategory && !matchSubArticles) {
          return false
        }
      }

      return true
    })
    : []

  return (
    <main className="min-h-screen bg-background">
      <NewsHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Massive Header Section */}
      <div className="w-full flex justify-center items-center py-8 sm:py-12 border-b border-border bg-background">
        <h1 className="text-7xl sm:text-9xl md:text-[160px] font-display text-foreground uppercase tracking-wider leading-[0.8] text-center w-full max-w-[1400px] px-4 cursor-default">
          <ScrambleText text="ONYEAKỤKỌ" />
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <NewsFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedSentiment={selectedSentiment}
          setSelectedSentiment={setSelectedSentiment}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        {/* Active Search Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search Results for:</span>
              <span className="text-sm font-black text-[#e59c6a]">"{searchQuery}"</span>
              <span className="text-xs text-muted-foreground">({filteredArticles.length} found)</span>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {loading ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="w-full lg:w-2/3">
                <div className="flex flex-col pb-6 animate-pulse">
                  <div className="w-full aspect-[16/9] bg-muted mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2.5 w-20 bg-muted rounded-full" />
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <div className="h-2.5 w-16 bg-muted rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="h-8 md:h-10 w-full bg-muted rounded-sm" />
                    <div className="h-8 md:h-10 w-4/5 bg-muted rounded-sm" />
                  </div>
                  <div className="w-full border-b border-dashed border-border mb-4" />
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="h-4 w-full bg-muted rounded-full" />
                    <div className="h-4 w-full bg-muted rounded-full" />
                    <div className="h-4 w-3/4 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <SportsScores />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                    <h2 className="text-xl font-black uppercase tracking-wider text-foreground">Latest Stories</h2>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">LOADING</span>
                  </div>
                  <div className="flex flex-col gap-4 animate-pulse">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-24 h-24 bg-muted flex-shrink-0" />
                        <div className="flex-1 flex flex-col justify-center gap-2">
                          <div className="h-2.5 w-16 bg-muted rounded-full" />
                          <div className="h-4 w-full bg-muted rounded-sm" />
                          <div className="h-4 w-5/6 bg-muted rounded-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-wider text-foreground">Even More Stories</h2>
              <div className="h-[1px] flex-1 bg-border/50"></div>
            </div>
            <NewsGrid articles={[]} loading={true} />
          </>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl my-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-foreground mb-2">No Stories Found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No stories matched your search for "${searchQuery}". Try different keywords or reset filters.`
                : "No articles found matching your selected category."}
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-[#e59c6a] text-black rounded-full hover:opacity-90 transition-all"
                >
                  Clear Search
                </button>
              )}
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-muted text-foreground rounded-full hover:bg-muted/80 transition-all"
                >
                  View All Feed
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="w-full lg:w-2/3">
                <HeroArticle {...filteredArticles[0]} />
              </div>
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <SportsScores />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                    <h2 className="text-xl font-black uppercase tracking-wider text-foreground">Latest Stories</h2>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{filteredArticles.length - 1} MORE</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {filteredArticles.slice(1, 5).map(article => (
                      <SidebarArticle key={article.id} {...article} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* OnyeAkụkọ Instant Headline & Link Credibility Checker */}
            {/* <div className="mb-12">
              <HeadlineChecker />
            </div> */}

            {filteredArticles.length > 5 && (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-wider text-foreground">Even More Stories</h2>
                  <div className="h-[1px] flex-1 bg-border/50"></div>
                </div>
                <NewsGrid articles={filteredArticles.slice(5)} loading={false} />
              </>
            )}
          </>
        )}
      </div>

      <NewsFooter />
    </main>
  )
}
