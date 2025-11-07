"use client"

import { Bookmark, ExternalLink } from "lucide-react"
import { useState } from "react"

interface NewsArticleProps {
  title: string
  description: string
  source: string
  category: string
  sentiment: "positive" | "neutral" | "negative"
  date: string
  link: string
  credibility: number
  imageUrl: string
}

export function NewsArticle({
  title,
  description,
  source,
  category,
  sentiment,
  date,
  link,
  credibility,
  imageUrl,
}: NewsArticleProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-accent bg-muted"
      case "negative":
        return "text-destructive bg-muted"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😔"
      default:
        return "😐"
    }
  }

  return (
    <article className="bg-card border-2 border-border rounded-lg overflow-hidden hover:border-[#e59c6a] transition-shadow h-full flex flex-col group">
      <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {imageUrl && imageUrl !== "N/A" ? (
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-accent uppercase tracking-wide">{source}</span>
          <span className={`text-xs px-2 py-1 font-semibold ${getSentimentColor(sentiment)}`}>
           {sentiment}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2">{title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-muted">
          <span>{new Date(date).toLocaleDateString()}</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{Math.round(credibility * 100)}% credible</span>
          </div>
        </div>


        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isBookmarked ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
            {isBookmarked ? "Saved" : "Save"}
          </button>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            {/* <ExternalLink className="h-4 w-4" /> */}
             Read →
          </a>
        </div>
      </div>
    </article>
  )
}
