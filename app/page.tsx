"use client"

import { useState, useEffect } from "react"
import { NewsHeader } from "@/components/news-header"
import { NewsFilters } from "@/components/news-filters"
import { NewsGrid } from "@/components/news-grid"
import { ScrambleText } from "@/components/scramble-text"
import { HeroArticle } from "@/components/hero-article"
import { SidebarArticle } from "@/components/sidebar-article"

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
}

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("today")

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
        setArticles([]) // Set empty array on error instead of leaving undefined
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [selectedCategory, selectedRegion, selectedSentiment, timeRange])

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((article) => {
      if (selectedCategory !== "all" && article.category !== selectedCategory) return false
      if (selectedRegion !== "all" && article.region !== selectedRegion) return false
      if (selectedSentiment !== "all" && article.sentiment !== selectedSentiment) return false
      return true
    })
    : []

  return (
    <main className="min-h-screen bg-background">
      <NewsHeader selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

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

        {loading ? (
          <NewsGrid articles={[]} loading={true} />
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="w-full lg:w-2/3">
                <HeroArticle {...filteredArticles[0]} />
              </div>
              <div className="w-full lg:w-1/3 flex flex-col">
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
    </main>
  )
}
