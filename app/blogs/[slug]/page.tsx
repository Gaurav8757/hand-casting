"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  tags: string[]
  is_active: boolean
  author: string
  created_at: string
  updated_at: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  const fetchBlog = async () => {
    try {
      const response = await fetch("/api/admin/blogs?show=true")
      const data = await response.json()
      const allBlogs = data.blogs || []
      
      const currentBlog = allBlogs.find((b: Blog) => b.slug === slug)
      setBlog(currentBlog || null)

      if (currentBlog) {
        // Find related blogs with similar tags
        const related = allBlogs
          .filter((b: Blog) => 
            b.id !== currentBlog.id && 
            b.tags.some((tag: string) => currentBlog.tags.includes(tag))
          )
          .slice(0, 3)
        setRelatedBlogs(related)
      }
    } catch (error) {
      console.error("Failed to fetch blog")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Blog Not Found</h1>
            <p className="text-muted-foreground">The blog you're looking for doesn't exist.</p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />

      {/* Hero Section */}
      <article className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-full font-medium flex items-center gap-2"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{getReadingTime(blog.content)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">By {blog.author}</span>
            </div>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-foreground">Enjoyed this article?</p>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Share2 size={20} />
                Share with Friends
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="pb-20 px-4 md:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blogs/${relatedBlog.slug}`}
                  className="group glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {relatedBlog.featured_image ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={relatedBlog.featured_image}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Tag className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {relatedBlog.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedBlog.excerpt || relatedBlog.content.substring(0, 100) + "..."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
