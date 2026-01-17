import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET all blogs (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const showOnly = searchParams.get("show") === "true"

    let query = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })

    if (showOnly) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ blogs: data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { title, slug, content, excerpt, featured_image, tags, is_active, author } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          slug,
          content,
          excerpt,
          featured_image,
          tags: tags || [],
          is_active: is_active ?? true,
          author: author || "Admin",
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ blog: data[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, title, slug, content, excerpt, featured_image, tags, is_active } = body

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title,
        slug,
        content,
        excerpt,
        featured_image,
        tags,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ blog: data[0] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
