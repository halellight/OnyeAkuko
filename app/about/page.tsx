"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles, AlertCircle, Bookmark } from "lucide-react"
import { NewsFooter } from "@/components/news-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="font-display text-lg sm:text-xl tracking-widest uppercase text-foreground">
            OnyeAkụkọ
          </Link>

          <div className="w-20 sm:w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full">
        {/* Newspaper Heading Accent */}
        <div className="text-center border-b-4 border-double border-foreground pb-6 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e59c6a] mb-2">
            Editorial Section — Established 2025
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground font-sans">
            THE STORYTELLER
          </h1>
          <p className="text-sm font-serif italic text-muted-foreground mt-2 max-w-xl mx-auto">
            "Demystifying African media framing, checking political bias, and placing truth above narratives."
          </p>
        </div>

        {/* Article Grid / Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-2">
              Who We Are
            </h2>
            <p className="text-base sm:text-lg text-foreground font-serif leading-relaxed">
              <strong>OnyeAkụkọ</strong> (literally meaning <em>"The Storyteller"</em> or <em>"The News Bearer"</em> in Igbo) is a next-generation media literacy platform and news aggregator designed specifically for Nigerian and African current affairs. Founded in 2025 by <a href="https://praiseibe.com/wiki" target="_blank" rel="noopener noreferrer" className="underline text-[#e59c6a] hover:opacity-85">Praise Ibe</a>, the platform was built to demystify African media framing.
            </p>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              In an era dominated by hyper-partisan framing, clickbait headlines, and unchecked editorial biases, obtaining a balanced understanding of critical events can feel impossible. OnyeAkụkọ was built to cut through the noise by aggregating coverage of the same event across multiple local and international media outlets.
            </p>

            <div className="my-4 border-l-4 border-[#e59c6a] bg-muted/20 p-5 font-serif italic text-foreground">
              "We don't tell you what to think. We show you how the same story is being told by different sides, and let you make up your own mind."
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-2 mt-4">
              Our Methodology
            </h2>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Every day, our systems automatically crawl and monitor top Nigerian and international news publications. Rather than dumping raw feeds, we employ advanced clustering and analysis models to:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-base text-muted-foreground font-serif">
              <li>
                <strong className="text-foreground">Cluster Headlines:</strong> Group articles covering the exact same event so you can view all coverage side-by-side.
              </li>
              <li>
                <strong className="text-foreground">Detect Political Framing:</strong> Evaluate the tone and source alignment (Government-aligned, Opposition-leaning, Independent, or Mainstream) to expose underlying biases.
              </li>
              <li>
                <strong className="text-foreground">Generate Objective Summaries:</strong> Create factual, cross-referenced TL;DR summaries that strip away sensationalism.
              </li>
            </ul>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6 bg-muted/15 p-6 border border-border">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Bookmark className="h-4 w-4 text-[#e59c6a]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                Core Pillars
              </h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-[#e59c6a] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground">AI Curation</h4>
                  <p className="text-xs text-muted-foreground font-serif mt-1">
                    Smart summaries and metadata that save time and structure your daily intake.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-[#e59c6a] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Media Literacy</h4>
                  <p className="text-xs text-muted-foreground font-serif mt-1">
                    Helping readers recognize the differences in how government, opposition, and independent outlets present events.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#e59c6a] fill-none stroke-current stroke-2 flex-shrink-0">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Open & Transparent</h4>
                  <p className="text-xs text-muted-foreground font-serif mt-1">
                    We clearly document all media sources and invite scrutiny on our aggregation methods.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-2">Our Sources</h4>
              <p className="text-[11px] text-muted-foreground font-serif leading-relaxed">
                We monitor major publications like TechCabal, Punch, Premium Times, Daily Trust, Vanguard, BusinessDay, and foreign outlets to balance perspective.
              </p>
            </div>
          </div>

        </div>
      </main>

      <NewsFooter />
    </div>
  )
}
