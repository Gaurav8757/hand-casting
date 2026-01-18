import { type NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { name, mobileNumber, password } = await request.json()

    if (!name || !mobileNumber || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from("admin_users")
      .select("id")
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // If admin already exists, block registration
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({ 
        error: "Admin registration is disabled. An admin account already exists." 
      }, { status: 403 })
    }

    const passwordHash = await bcryptjs.hash(password, 10)

    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        name,
        mobile_number: mobileNumber,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
    }

    return NextResponse.json({ message: "Admin registered successfully", data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 })
  }
}
