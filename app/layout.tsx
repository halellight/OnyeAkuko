import type React from "react"
import type { Metadata } from "next"
import { Merriweather, Anton } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { NewsletterModal } from "@/components/newsletter-modal"
import { SettingsPanel } from "@/components/settings-panel"
import { ThemeProvider } from "@/components/theme-provider"

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap"
})

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap"
})

export const metadata: Metadata = {
  title: "OnyeAkụkọ | Breaking News, Nigerian News & Global Updates",
  description: "Get the latest breaking News, Nigerian News, politics, business, and global updates curated by AI. Stay informed with OnyeAkụkọ's credible news aggregator.",
  keywords: [
    "News",
    "Nigerian News",
    "Breaking News",
    "Nigeria",
    "Nigerian politics",
    "World News",
    "Business News",
    "Technology News",
    "Latest News Nigeria",
    "African News",
    "OnyeAkuko",
    "OnyeAkụkọ",
    "government",
    "public officials",
    "politics",
    "AI News Curator"
  ],
  authors: [
    {
      name: "Praise Ibe",
      url: "https://onyeakuko.online",
    },
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/Group728.png",
    other: [
      {
        rel: "manifest",
        url: "/manifest.json",
      },
    ],
  },
  creator: "Praise Ibe",
  openGraph: {
    title: "OnyeAkụkọ | Breaking News, Nigerian News & Global Updates",
    description: "Get the latest breaking News, and global updates curated by AI.",
    url: "https://onyeakuko.online",
    siteName: "OnyeAkụkọ",
    images: [
      {
        url: "/Group728.png",
        width: 1200,
        height: 630,
        alt: "OnyeAkụkọ - News and Updates",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnyeAkụkọ | Breaking News, Nigerian News & Global Updates",
    description: "Get the latest breaking News, Nigerian News, politics, business, and global updates curated by AI. Stay informed with OnyeAkụkọ's credible news aggregator.",
    images: ["/Group728.png"],
    creator: "@OnyeAkuko",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://onyeakuko.online"),
  other: {
    "google-adsense-account": "ca-pub-5452830954847505"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "OnyeAkụkọ",
    "url": "https://onyeakuko.online",
    "logo": "https://onyeakuko.online/Group728.png",
    "description": "Get the latest breaking News, Nigerian News, politics, business, and global updates curated by AI."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${merriweather.variable} ${anton.variable} font-sans antialiased text-[#111]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <NewsletterModal />
          <SettingsPanel />
          <Toaster theme="system" position="top-center" />
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  )
}
