import { type NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, password } = await request.json()

    if (!mobileNumber || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: admin, error: queryError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("mobile_number", mobileNumber)
      .single()

    if (queryError || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    const token = jwt.sign(
      { id: admin.id, mobileNumber: admin.mobile_number },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "24h" },
    )

    const response = NextResponse.json({ message: "Login successful", admin }, { status: 200 })

    // Set JWT token in secure cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 })
  }
}
