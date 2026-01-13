"use client"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function HeroProduct() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Content */}
        <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/20 rounded-full text-accent font-medium text-sm">
              ✨ Premium Hand Casting Kit
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
              Hold Their Hand
              <span className="text-accent"> Forever</span>
            </h1>
            <p className="text-lg text-foreground/70 text-balance max-w-lg leading-relaxed">
              Create stunning 3D hand sculptures that capture precious moments. Perfect for newborns, couples, families,
              and unforgettable milestones. Skin-safe, simple, and ready to cherish for a lifetime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="#contact-form" className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200">
              Get Started • ₹49.99
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 active:scale-95 transition-all duration-200">
              See How It Works
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-foreground/70 font-medium">4.9/5 (2,340+ Reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">✓</span>
                <span className="text-foreground/70">
                  <span className="font-semibold text-foreground">Skin-Safe</span> & Non-Toxic
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xl">✓</span>
                <span className="text-foreground/70">Ships Next Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Image */}
        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden glass">
            <img
              src="/premium-hand-casting-kit-with-molds-and-tools.jpg"
              alt="Hand Casting Kit Contents - Create Beautiful 3D Hand Sculptures"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl max-w-xs">
            <p className="text-sm font-semibold text-foreground">Complete Kit Includes:</p>
            <ul className="text-xs text-foreground/70 space-y-1 mt-2">
              <li>✓ 1800g Premium Molding Powder</li>
              <li>✓ High-Grade Casting Stone</li>
              <li>✓ Professional Mixing Tools</li>
              <li>✓ Wooden Display Stand</li>
              <li>✓ Complete Instructions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-accent" size={32} />
      </div>
    </section>
  )
}
