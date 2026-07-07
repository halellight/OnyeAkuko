"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewsFooter } from "@/components/news-footer"

export default function PrivacyPage() {
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
            Data & Privacy Standards
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground font-sans">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-bold">
            Last Updated: July 7, 2026
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="flex flex-col gap-6 text-foreground font-serif text-sm sm:text-base leading-relaxed">
          <p>
            At <strong>OnyeAkụkọ</strong>, accessible from <a href="https://onyeakuko.online" className="underline text-[#e59c6a] hover:opacity-85">https://onyeakuko.online</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by OnyeAkụkọ and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:praiseibec@gmail.com" className="underline text-[#e59c6a] hover:opacity-85">praiseibec@gmail.com</a>.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            1. Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            2. Information We Collect
          </h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-muted-foreground">
            <li><strong>Email Subscription:</strong> If you register for our newsletter or update notifications, we collect your email address.</li>
            <li><strong>Account Sign-In:</strong> When registering via Supabase Auth, we collect profile details (such as avatar URLs, emails, and names) provided by authentication brokers.</li>
            <li><strong>Interaction Data:</strong> We track article interaction data locally (such as clicks on specific publications) to generate your personalized News Diet analysis inside your browser local storage.</li>
          </ul>

          <h2 className="text-xl font-black uppercase tracking-tight text-[#e59c6a] font-sans border-b border-border pb-1 mt-6">
            3. Google DoubleClick DART Cookie & AdSense Policies
          </h2>
          <p className="bg-[#e59c6a]/5 p-5 border border-[#e59c6a]/30 text-foreground">
            Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <code>onyeakuko.online</code> and other sites on the internet. 
          </p>
          <p>
            However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="underline text-[#e59c6a] hover:opacity-85 break-all">https://policies.google.com/technologies/ads</a>.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            4. Our Advertising Partners
          </h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-muted-foreground">
            <li><strong>Google AdSense:</strong> Each of our advertising partners has their own Privacy Policy for their policies on user data. For easy access, their Privacy Policies are hyperlinked.</li>
          </ul>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            5. Log Files & Analytics
          </h2>
          <p>
            OnyeAkụkọ follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
          <p>
            We also use <strong>Vercel Analytics</strong> to monitor performance and general usage statistics.
          </p>

          <h2 className="text-xl font-black uppercase tracking-tight text-foreground font-sans border-b border-border pb-1 mt-6">
            6. CCPA & GDPR Data Protection Rights
          </h2>
          <p>
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-muted-foreground">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
            <li><strong>The right to restrict or object to processing:</strong> You have the right to request that we restrict or object to our processing of your personal data under certain conditions.</li>
          </ul>
          <p>
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
          </p>
        </div>
      </main>

      <NewsFooter />
    </div>
  )
}
