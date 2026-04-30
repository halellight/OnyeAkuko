"use client"

import Link from "next/link"
import { useState } from "react"

interface SidebarArticleProps {
  title: string
  source: string
  date: string
  imageUrl: string
  link: string
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

export function SidebarArticle({
  title,
  source,
  date,
  imageUrl,
}: SidebarArticleProps) {
  const [imageError, setImageError] = useState(false)
  const articleSlug = slugify(title)
  const articleHref = `/article/${encodeURIComponent(articleSlug)}`

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })

  const noImage = !imageUrl || imageUrl === "N/A" || imageError

  return (
    <article className="group flex gap-4 items-start py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors rounded-lg px-2 -mx-2">
      <Link href={articleHref} className="flex-1 flex flex-col justify-center min-w-0">
        <h4 className="text-base font-bold text-foreground leading-tight mb-2 group-hover:text-[#e59c6a] transition-colors line-clamp-3">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-bold text-foreground/80 flex items-center gap-1.5">
             <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-black overflow-hidden">
                {source.charAt(0)}
             </div>
             {source}
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </Link>
      
      {!noImage && (
        <Link href={articleHref} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
    </article>
  )
}
