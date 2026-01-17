"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import ReviewsSection from "./reviews-section"

export default function Testimonials() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Static testimonials
  const staticTestimonials = [
    {
      id: 1,
      name: "Jennifer & Michael",
      role: "Newlyweds",
      content:
        "This kit exceeded our expectations! Creating our hand cast was such a special bonding experience. It's now our favorite display piece.",
      image: "/couple-portrait.jpg",
      rating: 5,
      isStatic: true,
    },
    {
      id: 2,
      name: "Amanda Torres",
      role: "New Mom",
      content:
        "Captured my baby's tiny hands forever. The quality is incredible and it arrived so beautifully packaged. Highly recommend!",
      image: "/woman-portrait.jpg",
      rating: 5,
      isStatic: true,
    },
    {
      id: 3,
      name: "Robert Chen",
      role: "Grandparent",
      content:
        "The perfect gift for preserving memories with my grandchildren. Easy to use and the results are museum-quality beautiful.",
      image: "/man-portrait.jpg",
      rating: 5,
      isStatic: true,
    },
    {
      id: 4,
      name: "Sarah & David",
      role: "Parents of Two",
      content: "We made casts of all three kids' hands. This kit brings so much joy to our home. Worth every penny!",
      image: "/family-portrait.jpg",
      rating: 5,
      isStatic: true,
    },
  ]

  useEffect(() => {
    fetchApprovedReviews()
  }, [])

  async function fetchApprovedReviews() {
    try {
      const { data, error } = await supabase
        .from("customer_ratings")
        .select("*")
        .eq("display_on_landing", true)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) throw error

      const dbTestimonials = (data || []).map((review: any) => ({
        id: review.id,
        name: review.customer_name,
        role: "Verified Customer",
        content: review.review_text,
        image: "/placeholder.svg",
        rating: review.rating,
        isStatic: false,
      }))

      // Combine static and dynamic reviews
      setTestimonials([...dbTestimonials, ...staticTestimonials.slice(0, 4 - dbTestimonials.length)])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setTestimonials(staticTestimonials)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="testimonials" className="py-20  px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            <span className="text-accent">Loved by Families</span> Worldwide
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Thousands of customers have created lasting memories with CastKeep
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="overflow-y-auto h-[540px] rounded-xl p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="glass shadow-2xl p-4 space-y-4 hover:bg-white/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                     <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-accent text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-foreground/80 italic">"{testimonial.content}"</p>

               
                </div>
              ))}
            </div>

          </div>
          <ReviewsSection />
        </div>
           {/* Trust Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="glass p-6 text-center space-y-2 shadow-2xl">
                <div className="text-3xl font-bold text-accent">5,000+</div>
                <p className="text-foreground/70">Happy Customers</p>
              </div>
              <div className="glass p-6 text-center space-y-2 shadow-2xl">
                <div className="text-3xl font-bold text-accent">4.9★</div>
                <p className="text-foreground/70">Average Rating</p>
              </div>
              <div className="glass p-6 text-center space-y-2 shadow-2xl">
                <div className="text-3xl font-bold text-accent">98%</div>
                <p className="text-foreground/70">Would Recommend</p>
              </div>
            </div>
      </div>

    </section>
  )
}
