"use client"

import Link from "next/link"
import { Home, ArrowLeft, SearchX } from "lucide-react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      })
      
      gsap.to(".floating-icon", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="gradient-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      {/* Content */}
      <div className="max-w-md w-full text-center space-y-8 glass p-8 md:p-12 border-white/20 shadow-2xl relative z-10">
        
        <div className="floating-icon w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-item">
            <SearchX className="w-12 h-12 text-muted-foreground" />
        </div>

        <div className="space-y-4 animate-item">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            It looks like this memory hasn't been cast yet. The page you're looking for seems to have slipped through the mold.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-item pt-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-colors font-medium text-foreground"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center animate-item">
        <p className="text-sm text-muted-foreground/60">
          CastKeep - Preserving Memories
        </p>
      </div>
    </div>
  )
}