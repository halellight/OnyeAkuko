"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Globe, MapPin } from "lucide-react"
import { NewsFooter } from "@/components/news-footer"

export default function ContactPage() {
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full flex flex-col justify-center">
        {/* Newspaper Heading Accent */}
        <div className="text-center border-b-4 border-double border-foreground pb-6 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e59c6a] mb-2">
            Direct Correspondence
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground font-sans">
            Get In Touch
          </h1>
          <p className="text-sm font-serif italic text-muted-foreground mt-2 max-w-xl mx-auto">
            We value direct communication. You can reach OnyeAkụkọ and its founder through the channels below.
          </p>
        </div>

        {/* Center Contact Card */}
        <div className="border border-border bg-card p-6 sm:p-10 flex flex-col gap-8">
          
          <div className="flex flex-col gap-3 border-b border-border/60 pb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#e59c6a]">
              Founder & Publisher
            </h2>
            <p className="text-2xl font-black text-foreground uppercase tracking-tight font-sans">
              Praise Ibe
            </p>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">
              OnyeAkụkọ was established in 2025 by Praise Ibe to support public media transparency and media literacy in Nigeria and across the African continent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Contact */}
            <a 
              href="mailto:praiseibec@gmail.com"
              className="group border border-border hover:border-[#e59c6a]/40 bg-muted/15 hover:bg-[#e59c6a]/5 p-5 transition-all duration-300 flex items-start gap-4"
            >
              <Mail className="h-6 w-6 text-[#e59c6a] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-[#e59c6a] transition-colors">
                  Direct Email
                </h3>
                <p className="text-sm font-serif text-muted-foreground mt-1 group-hover:text-foreground transition-colors break-all">
                  praiseibec@gmail.com
                </p>
              </div>
            </a>

            {/* Wiki Link */}
            <a 
              href="https://praiseibe.com/wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border hover:border-[#e59c6a]/40 bg-muted/15 hover:bg-[#e59c6a]/5 p-5 transition-all duration-300 flex items-start gap-4"
            >
              <Globe className="h-6 w-6 text-[#e59c6a] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-[#e59c6a] transition-colors">
                  Founder Wiki
                </h3>
                <p className="text-sm font-serif text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                  praiseibe.com/wiki
                </p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4 border-t border-border/60">
            <MapPin className="h-4 w-4 text-[#e59c6a]" />
            <span>Lagos, Nigeria — Operational Hub</span>
          </div>

        </div>
      </main>

      <NewsFooter />
    </div>
  )
}
