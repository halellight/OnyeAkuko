"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewsFooter } from "@/components/news-footer"

export default function TermsPage() {
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full">
        {/* Newspaper Heading Accent */}
        <div className="border-b border-foreground pb-6 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e59c6a] mb-2">
            Legal Terms & Notices
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground font-sans">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-bold">
            Last Updated: July 7, 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="flex flex-col gap-6 text-foreground font-serif text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <strong>OnyeAkụkọ</strong>. Please read these Terms of Service ("Terms") carefully before using our website at <a href="https://onyeakuko.online" className="underline text-[#e59c6a] hover:opacity-85">https://onyeakuko.online</a> (the "Service") operated by OnyeAkụkọ ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            1. Intellectual Property & Aggregated Content
          </h2>
          <p>
            OnyeAkụkọ functions as a news curation and media literacy platform. All article summaries, metadata, bias analysis charts, and platform branding are the property of OnyeAkụkọ. 
          </p>
          <p>
            The original news articles, headlines, logos, and publication names clustered by the Service remain the property of their respective third-party owners and publishers. OnyeAkụkọ does not claim ownership of, nor is it responsible for, the contents of these third-party news sources. We aggregate headlines and provide brief descriptive summaries under standard fair-use doctrines for informational and analytical purposes.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            2. Use License & Conduct
          </h2>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access the public portions of the Service for your personal, non-commercial use. As a user, you agree not to:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-muted-foreground">
            <li>Attempt to reverse-engineer, disrupt, or bypass any security features of the Service.</li>
            <li>Use automated crawlers or scrapers to extract OnyeAkụkọ's compiled dataset without explicit prior written authorization.</li>
            <li>Use the platform for any illegal purpose or to promote hate speech, harassment, or misinformation.</li>
          </ul>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            3. Disclaimer of Warranties
          </h2>
          <p className="italic bg-muted/20 p-4 border-l-2 border-[#e59c6a] text-muted-foreground text-xs sm:text-sm">
            The Service and all materials, news summaries, and media bias insights are provided on an "as is" and "as available" basis. OnyeAkụkọ makes no warranties, expressed or implied, regarding the accuracy, completeness, reliability, or timeliness of the information gathered from external publishers. While our AI curation attempts to remain objective, we do not verify the factual statements made within third-party articles.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall OnyeAkụkọ, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) any content obtained from the Service.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            5. Termination
          </h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:praiseibec@gmail.com" className="underline text-[#e59c6a] hover:opacity-85">praiseibec@gmail.com</a> or through our <Link href="/contact" className="underline text-[#e59c6a] hover:opacity-85">Contact Page</Link>.
          </p>
        </div>
      </main>

      <NewsFooter />
    </div>
  )
}
