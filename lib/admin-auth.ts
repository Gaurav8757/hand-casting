import bcryptjs from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export async function registerAdmin(mobileNumber: string, password: string, name: string) {
  const supabase = await createClient()
  const passwordHash = await hashPassword(password)

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      mobile_number: mobileNumber,
      password_hash: passwordHash,
      name,
    })
    .select()
    .single()

  return { data, error }
}

export async function loginAdmin(mobileNumber: string, password: string) {
  const supabase = await createClient()

  const { data: admin, error: queryError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("mobile_number", mobileNumber)
    .single()

  if (queryError || !admin) {
    return { error: "Invalid credentials" }
  }

  const isPasswordValid = await verifyPassword(password, admin.password_hash)

  if (!isPasswordValid) {
    return { error: "Invalid credentials" }
  }

  // Update last login
  await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

  return { data: admin, error: null }
}
