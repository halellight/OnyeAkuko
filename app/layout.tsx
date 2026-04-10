import type React from "react"
import type { Metadata } from "next"
import { Merriweather, Anton } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { NewsletterModal } from "@/components/newsletter-modal"

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
  title: "OnyeAkuko - Your AI-Powered News Curator",
  description: "Stay informed with curated news from credible sources across all major categories",
  keywords: [
    "Nigerian leaders",
    "public officials",
    "politics",
    "government",
    "ratings",
    "news",
    "share opinions",
    "Nigerian politics",
  ],
  authors: [
    {
      name: "Praise Ibe",
      url: "https://oneyeakuko.online",
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
    title: "OnyeAkuko - Your AI-Powered News Curator",
    description: "Stay informed with curated news from credible sources across all major categories",
    url: "https://oneyeakuko.online",
    siteName: "OnyeAkuko",
    images: [
      {
        url: "/Group728.png",
        width: 1200,
        height: 630,
        alt: "Your AI-Powered News Curator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnyeAkuko - Your AI-Powered News Curator",
    description: "Stay informed with curated news from credible sources across all major categories",
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
  metadataBase: new URL("https://oneyeakuko.online"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${merriweather.variable} ${anton.variable} font-sans antialiased text-[#111]`}>
        {children}
        <NewsletterModal />
        <Toaster theme="dark" position="top-center" />
      </body>
      <Analytics />
    </html>
  )
}
