"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { CheckCircle, AlertCircle, Truck, RotateCcw } from "lucide-react"

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen   bg-background overflow-hidden font-sans">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shipping & Return Policy
            </h1>
            <p className="text-lg text-foreground/70">
              At Bloody Boka, we take immense pride in the craftsmanship of every piece.
              <br/> Because our products are handmade and customized, they require time and care.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Policy */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {/* Processing Time */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <Truck className="text-primary mt-1 shrink-0" size={28} />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Processing Time</h2>
                  <ul className="space-y-3 text-foreground/70">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Quick Gifts (Prints/String Art):</strong> 3–5 business days.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Custom Miniatures & Resin Preservation:</strong> 15–25 business days (due to the complex drying and curing process).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Shipping Rates</h3>
              <p className="text-foreground/70">Calculated at checkout based on weight and your location from our Kolkata studio.</p>
            </div>

            {/* Delivery Estimates */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Delivery Estimates</h3>
              <p className="text-foreground/70">Once shipped, domestic orders usually arrive within 5–7 business days.</p>
            </div>

            {/* Fragile Handling */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Fragile Handling</h3>
              <p className="text-foreground/70">We use premium, multi-layer shockproof packaging to ensure your 3D casts and frames arrive safely.</p>
            </div>

            {/* Tracking */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Tracking</h3>
              <p className="text-foreground/70">You will receive a tracking ID via WhatsApp/Email as soon as Sayan or Sujay hands your package to our courier partner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund & Cancellation Policy */}
      <section className="py-16 px-4 md:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Refund & Cancellation Policy</h2>
          
          <p className="text-lg text-foreground/70 mb-8 text-center">
            Because our products are personalized and made-to-order, we have a strict policy regarding returns.
          </p>

          <div className="space-y-8">
            {/* Cancellations */}
            <div className="glass p-8 rounded-2xl border border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="text-accent mt-1 shrink-0" size={28} />
                <div className="w-full">
                  <h3 className="text-xl font-bold text-foreground mb-4">Cancellations</h3>
                  <p className="text-foreground/70">
                    You can cancel your order within 24 hours of placement for a full refund. After 24 hours, the creative process (raw material prep) begins, and cancellations are no longer accepted.
                  </p>
                </div>
              </div>
            </div>

            {/* Returns/Exchanges */}
            <div className="glass p-8 rounded-2xl border border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <RotateCcw className="text-accent mt-1 shrink-0" size={28} />
                <div className="w-full">
                  <h3 className="text-xl font-bold text-foreground mb-4">Returns/Exchanges</h3>
                  <p className="text-foreground/70">
                    We do not accept returns on customized items (Hand Casting, Miniatures, String Art with names) unless the item arrives damaged.
                  </p>
                </div>
              </div>
            </div>

            {/* Damaged Goods */}
            <div className="glass p-8 rounded-2xl border border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="text-accent mt-1 shrink-0" size={28} />
                <div className="w-full">
                  <h3 className="text-xl font-bold text-foreground mb-4">Damaged Goods</h3>
                  <div className="space-y-3 text-foreground/70">
                    <p>In the rare event that your art piece arrives damaged, you must provide an unboxing video within 24 hours of delivery.</p>
                    <p>Upon verification, Bloody Boka will either repair the item or send a replacement at no extra cost.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand Casting Sessions */}
            <div className="glass p-8 rounded-2xl border border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="text-accent mt-1 shrink-0" size={28} />
                <div className="w-full">
                  <h3 className="text-xl font-bold text-foreground mb-4">Hand Casting Sessions</h3>
                  <p className="text-foreground/70">
                    Studio session bookings are non-refundable but can be rescheduled once if notified 48 hours in advance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center glass p-8 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">Questions About Our Policy?</h3>
          <p className="text-foreground/70 mb-6">
            Our team is here to help. Contact us via WhatsApp, email, or call us directly.
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
