"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const faqs = [
    {
      id: 1,
      question: "Is the 3D Hand Casting process safe for skin?",
      answer: "Yes, 100%. We use premium, dental-grade Chromatypic Alginate. It is non-toxic, hypoallergenic, and organic. It is perfectly safe for newborns, elderly individuals, and even pets."
    },
    {
      id: 2,
      question: "How long does a Hand Casting session take?",
      answer: "The actual molding process is very quick! You only need to hold your pose for about 3 to 5 minutes while the material sets. However, we spend about 30 minutes with you to ensure the perfect pose and setup."
    },
    {
      id: 3,
      question: "Can I preserve my wedding flowers (Varmala) even if they have started to dry?",
      answer: "Absolutely. In fact, flowers must be completely dried before they are cast in resin. If your flowers are still fresh, we have a professional drying process to preserve their color and shape before the resin work begins."
    },
    {
      id: 4,
      question: "How long will my 3D Miniature or String Art take to be ready?",
      answer: "Since Sujay handcrafts every detail:\n\n• String Art/Prints: 3–5 days.\n• 3D Miniatures: 15–20 days (due to high-detail sculpting and painting).\n• Resin Art: 3–4 weeks (resin needs proper time to cure to a crystal-clear finish)."
    },
    {
      id: 5,
      question: "Do you ship outside of Kolkata?",
      answer: "We ship our String Art, Miniatures, and Resin Art all across India with shockproof packaging. However, for 3D Hand Casting, you must visit our Kolkata studio or book a home session (available within Kolkata limits), as we need your physical presence to create the mold."
    },
    {
      id: 6,
      question: "How do I clean my art piece?",
      answer: "For all our products, we recommend using a soft, dry microfiber cloth or a soft brush. Never use water or chemicals, as they can damage the metallic paint or the resin finish."
    }
  ]

  const toggleExpand = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden font-sans">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-foreground/70">
              Find answers to common questions about our services, processes, and products at Bloody Boka.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="glass border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-200"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground text-left">
                    {faq.id}. {faq.question}
                  </h3>
                  <ChevronDown
                    className={`shrink-0 text-primary transition-transform duration-300 ${
                      expandedItems.includes(faq.id) ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                {expandedItems.includes(faq.id) && (
                  <div className="px-6 py-4 border-t border-border/30 bg-white/2">
                    <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 px-4 md:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto text-center glass p-8 rounded-2xl border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-foreground/70 mb-8">
            Our team is always ready to help. Get in touch with Sayan and Sujay directly for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/7003020846"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-foreground font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:hello@bloodyboka.com"
              className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
            >
              Email Us
            </a>
            <a
              href="tel:+917003020846"
              className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
