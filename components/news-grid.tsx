"use client"

import { NewsArticle } from "./news-article"

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

function SkeletonCard() {
  return (
    <div className="flex flex-col pb-6 border-b border-border animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[16/9] bg-muted mb-4 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      </div>

      {/* Source + category */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2.5 w-20 bg-muted rounded-full" />
        <div className="w-1 h-1 rounded-full bg-border" />
        <div className="h-2.5 w-16 bg-muted rounded-full" />
      </div>

      {/* Title lines */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="h-6 w-full bg-muted rounded-sm" />
        <div className="h-6 w-4/5 bg-muted rounded-sm" />
        <div className="h-6 w-2/3 bg-muted rounded-sm" />
      </div>

      <div className="w-full border-b border-dashed border-border mb-4" />

      {/* Description lines */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="h-3.5 w-full bg-muted rounded-full" />
        <div className="h-3.5 w-full bg-muted rounded-full" />
        <div className="h-3.5 w-3/4 bg-muted rounded-full" />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-4 border-t border-border mb-5">
        <div className="h-2.5 w-24 bg-muted rounded-full" />
        <div className="h-2.5 w-20 bg-muted rounded-full" />
      </div>

      {/* Button skeleton */}
      <div className="flex gap-3">
        <div className="h-11 w-11 bg-muted rounded-lg flex-shrink-0" />
        <div className="h-11 flex-1 bg-[#e59c6a]/20 rounded-lg" />
      </div>
    </div>
  )
}

export function NewsGrid({ articles, loading }: NewsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
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
