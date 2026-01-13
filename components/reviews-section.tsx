"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Star } from "lucide-react"

export default function ReviewsSection() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    reviewText: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customerName.trim()) newErrors.customerName = "Name is required"
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address"
    }
    if (!formData.reviewText.trim()) newErrors.reviewText = "Please write a few words about your experience"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const { error } = await supabase.from("customer_ratings").insert({
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        rating: formData.rating,
        review_text: formData.reviewText,
        display_on_landing: false,
      })

      if (error) throw error

      setSubmitted(true)
      setFormData({
        customerName: "",
        customerEmail: "",
        rating: 5,
        reviewText: "",
      })
      setErrors({})

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      console.error("Error submitting review:", error)
      alert(error.message || "Error submitting review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Share Your Experience</h3>
            <p className="text-foreground/70">
              Tell us about your hand casting experience. Your review helps other families discover CastKeep!
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400">
              Thank you for your review! The admin will review and publish it shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                  {errors.customerName && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                  />
                  {errors.customerEmail && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.customerEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`transition-all ${num <= formData.rating ? "scale-110" : "opacity-60"}`}
                    >
                      <Star size={28} className="fill-accent text-accent" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
                <textarea
                  required
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary resize-none"
                  rows={4}
                  placeholder="Share your experience with CastKeep..."
                />
                {errors.reviewText && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.reviewText}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
