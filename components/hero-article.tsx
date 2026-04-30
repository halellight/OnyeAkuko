"use client"

import { Share2, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

interface HeroArticleProps {
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

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

export function HeroArticle({
  title,
  description,
  source,
  category,
  sentiment,
  date,
  link,
  credibility,
  imageUrl,
}: HeroArticleProps) {
  const [imageError, setImageError] = useState(false)
  const articleSlug = slugify(title)
  const articleHref = `/article/${encodeURIComponent(articleSlug)}`

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}${articleHref}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Article link copied! Redirects to OnyeAkụkọ.", {
      description: "You can now share this link."
    })
  }

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-[#4ade80] text-black"
      case "negative":
        return "bg-[#f87171] text-black"
      default:
        return "bg-[#94a3b8] text-black"
    }
  }

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const noImage = !imageUrl || imageUrl === "N/A" || imageError

  return (
    <article className="group relative w-full h-[500px] md:h-[600px] overflow-hidden bg-muted transition-transform duration-300 hover:-translate-y-1">
      <Link href={articleHref} className="block w-full h-full">
        {/* Background Image */}
        <img
          src={noImage ? "/Group728.png" : imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${noImage ? "opacity-50 grayscale object-contain p-12" : ""}`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getSentimentStyles(sentiment)}`}>
              {sentiment}
            </span> */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 border border-white/10">
              <span className="text-[10px] md:text-xs font-bold text-[#e59c6a] uppercase tracking-[0.2em]">{source}</span>
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">{category}</span>
            </div>
          </div>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tighter drop-shadow-md group-hover:text-[#e59c6a] transition-colors">
            {title}
          </h3>

          <p className="text-white/80 text-base md:text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl font-serif leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between text-white/60 text-xs md:text-sm pt-4 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="text-white font-bold">{Math.round(credibility * 100)}%</span>
                <span>Reliability</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 p-2 px-4 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-bold hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}
