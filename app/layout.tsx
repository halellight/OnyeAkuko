import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>{children}</body>
      <Analytics />
    </html>
  )
}
