import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://bloodyboka.com"),
  title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
  description:
    "Create beautiful, skin-safe 3D hand casting sculptures. Preserve precious memories with our complete hand casting kit. Perfect for families, couples, and special moments.",
  keywords: "hand casting kit, family keepsakes, 3D hand mold, couple gifts, memory preservation",
  creator: "Bloody Boka",
  publisher: "Bloody Boka",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloodyboka.com",
    title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
    description:
      "Create beautiful, skin-safe 3D hand casting sculptures. Preserve precious moments with our complete kit.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bloody Boka Hand Casting Kit",
      },
    ],
    siteName: "Bloody Boka"
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium 3D Hand Casting Kit | Create Family Keepsakes",
    description: "Preserve precious memories with our complete hand casting kit.",
    images: ["/og-image.jpg"],
  },
  generator: "gaurav",

  icons: {
    icon: [
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo.svg",
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
