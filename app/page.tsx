"use client"

import Navigation from "@/components/navigation"
import HeroProduct from "@/components/hero-product"
import ProductShowcase from "@/components/product-showcase"
import HowItWorks from "@/components/how-it-works"
import Gallery from "@/components/gallery"
import Testimonials from "@/components/testimonials"
import ReviewsSection from "@/components/reviews-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("section")
      sections.forEach((section: any) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen bg-background">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />
      <HeroProduct />
      <ProductShowcase />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
