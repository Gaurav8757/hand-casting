import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UAParser } from "ua-parser-js"

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()
    const supabase = await createClient();

    // Get IP (works on Vercel + local)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "Unknown"

    const userAgent = req.headers.get("user-agent") || ""

    // UA Parsing
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    const browser = result.browser.name ?? "Unknown"
    const os = result.os.name ?? "Unknown"
    const deviceType = result.device.type ?? "desktop"
    const deviceName = result.device.model
      ? `${result.device.vendor ?? ""} ${result.device.model}`.trim()
      : "Desktop"

    await supabase.from("customer_visits").insert({
      page_visited: page,
      user_agent: userAgent,
      ip_address: ip,
      browser,
      os,
      device_type: deviceType,
      device_name: deviceName
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TRACK VISIT ERROR]", error)
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
