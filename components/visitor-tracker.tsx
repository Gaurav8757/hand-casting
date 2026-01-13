"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function VisitorTracker() {
  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        const supabase = createClient()
        const currentPage = typeof window !== "undefined" ? window.location.pathname : "/"
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : ""

        // Fetch IP address
        let ipAddress = "Unknown"
        try {
          const ipResponse = await fetch("https://api.ipify.org?format=json")
          const ipData = await ipResponse.json()
          ipAddress = ipData.ip
        } catch (e) {
          console.error("Failed to fetch IP:", e)
        }

        // Simple UA parsing
        const browser = userAgent.includes("Chrome") ? "Chrome" : userAgent.includes("Firefox") ? "Firefox" : userAgent.includes("Safari") ? "Safari" : "Other"
        const os = userAgent.includes("Win") ? "Windows" : userAgent.includes("Mac") ? "MacOS" : userAgent.includes("Linux") ? "Linux" : userAgent.includes("Android") ? "Android" : userAgent.includes("Like Mac") ? "iOS" : "Other"
        const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? "Mobile" : "Desktop"

        // Insert visit data to Supabase
        await supabase.from("customer_visits").insert({
          page_visited: currentPage,
          user_agent: userAgent,
          ip_address: ipAddress,
          browser: browser,
          os: os,
          device_type: deviceType
        })
        
        console.log("[Analytics] Visit tracked:", currentPage, ipAddress)
      } catch (error) {
        console.error("[Analytics] Error tracking visit:", error)
      }
    }

    trackVisit()
  }, [])

  return null
}
