import Link from "next/link"

export function NewsFooter() {
  return (
    <footer className="w-full border-t border-border bg-muted/20 py-10 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-border/40 pb-8 mb-8">
          {/* Logo & Brand statement */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="font-display text-2xl tracking-widest uppercase text-foreground hover:opacity-85 transition-opacity">
              ONYEAKỤKỌ
            </Link>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-bold max-w-sm">
              Nigerian & African News aggregation curated by AI with bias framing insights.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/OnyeAkuko"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground hover:text-[#e59c6a] transition-colors border border-border px-4 py-2 hover:border-[#e59c6a]/40 bg-background/50"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
                <g>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.91z"></path>
                </g>
              </svg>
              Follow on X
            </a>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-muted-foreground">
            <Link href="/about" className="hover:text-[#e59c6a] transition-colors">
              About Us
            </Link>
            <Link href="/terms" className="hover:text-[#e59c6a] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#e59c6a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-[#e59c6a] transition-colors">
              Contact Us
            </Link>
          </div>

          <p className="text-muted-foreground/60 text-center sm:text-right">
            © {new Date().getFullYear()} OnyeAkụkọ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
