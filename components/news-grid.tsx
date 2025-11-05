"use client"

import { NewsArticle } from "./news-article"
import { Loader2 } from "lucide-react"

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

interface NewsGridProps {
  articles: Article[]
  loading: boolean
}

export function NewsGrid({ articles, loading }: NewsGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No articles found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsArticle key={article.id} {...article} />
      ))}
    </div>
  )
}
