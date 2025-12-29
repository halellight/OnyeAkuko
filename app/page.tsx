"use client"

import { useState, useEffect } from "react"
import { NewsHeader } from "@/components/news-header"
import { NewsFilters } from "@/components/news-filters"
import { NewsGrid } from "@/components/news-grid"

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
        const response = await fetch("/api/fetch-news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            region: selectedRegion !== "all" ? selectedRegion : undefined,
            sentiment: selectedSentiment !== "all" ? selectedSentiment : undefined,
            timeRange,
          }),
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
      <NewsHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <NewsGrid articles={filteredArticles} loading={loading} />
      </div>
    </main>
  )
}
