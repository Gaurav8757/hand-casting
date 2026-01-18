import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { name, mobileNumber, email, address, inquiryType, serviceTypes, message, commitmentAccepted } = await request.json()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("customer_submissions")
      .insert({
        name,
        mobile_number: mobileNumber,
        email,
        address,
        inquiry_type: inquiryType,
        service_types: serviceTypes || [],
        message,
        commitment_accepted: commitmentAccepted || false,
        submission_status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || "Submission failed" }, { status: 400 })
    }

    return NextResponse.json({ message: "Submission successful", data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 })
  }
}
