import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
  description:
    "Create beautiful, skin-safe 3D hand casting sculptures. Preserve precious memories with our complete hand casting kit. Perfect for families, couples, and special moments.",
  keywords: "hand casting kit, family keepsakes, 3D hand mold, couple gifts, memory preservation",
  creator: "CastKeep",
  publisher: "CastKeep",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://castkeep.com",
    title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
    description:
      "Create beautiful, skin-safe 3D hand casting sculptures. Preserve precious moments with our complete kit.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CastKeep Hand Casting Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
    description: "Preserve precious memories with our complete hand casting kit.",
    images: ["/og-image.jpg"],
  },
  generator: "gaurav",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

import SmoothScrolling from "@/components/smooth-scrolling"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SmoothScrolling>
          {children}
          <Analytics />
        </SmoothScrolling>
      </body>
    </html>
  )
}
