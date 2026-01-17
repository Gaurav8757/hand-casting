"use client"

import { useEffect, useRef } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Heart, ShieldCheck, Sparkles, Users, Clock, Award } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function AboutUs() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Hero Animation
        gsap.from(".hero-content", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        })

        // Reveal sections on scroll
        const sections = gsap.utils.toArray(".reveal-section")
        sections.forEach((section: any) => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
        })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  const team = [
    {
      name: "Sarah Henderson",
      role: "Founder & Artist",
      bio: "Starting with a passion for preserving family moments, Sarah turned her hobby into a premium craft."
    },
    {
        name: "David Chen",
        role: "Head of Product",
        bio: "Ensuring every kit meets the highest standards of safety and detail reproduction."
    },
     {
        name: "Emily Davis",
        role: "Creative Director",
        bio: "Designing the aesthetic that makes every CastKeep product a work of art."
    }
  ]

  const stats = [
      { label: "Happy Families", value: "10,000+" },
      { label: "Kits Delivered", value: "25,000+" },
      { label: "5-Star Reviews", value: "5,000+" }
  ]

  return (
    <main ref={mainRef} className="min-h-screen bg-background overflow-hidden font-sans">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center hero-content">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm border border-primary/20">
                <Sparkles size={16} />
                <span>Premium Quality Keepsakes</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
                Preserving Moments in <br/>
                <span className="text-primary relative inline-block">
                    Time & Detail
                     <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor"/>
                    </svg>
                </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We believe some memories are too precious to fade. Our mission is to give you a way to hold onto them forever—literally.
            </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-8 reveal-section">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden glass p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted group">
                      <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center group-hover:bg-secondary/40 transition-colors">
                          <div className="text-center p-6">
                              <Heart className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                              <span className="text-muted-foreground font-medium block">Every Detail Matters</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-accent font-semibold uppercase tracking-wider text-sm">
                      <Clock size={16} />
                      <span>Our Journey</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                      It all started in a small workshop with a big idea: what if we could freeze a moment in time? Not just a photograph, but something tangible. Something you could touch and feel.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                      At CastKeep, we spent years perfecting our alginate formula to ensure it captures every microscopic detail—from the tiniest wrinkle on a newborn's foot to the wedding ring on your partner's hand. We are dedicated to providing a safe, easy, and memorable experience for families everywhere.
                  </p>
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                      {stats.map((stat, i) => (
                          <div key={i}>
                              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Values / Why Choose Us */}
      <section className="py-20 px-4 md:px-8 bg-secondary/10 reveal-section">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Families Trust Us</h2>
                  <p className="text-muted-foreground text-lg">The CastKeep standard of excellence defines everything we do, from our materials to your experience.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { icon: ShieldCheck, title: "100% Skin Safe", desc: "Our formulas are non-toxic, hypoallergenic, and biodegradable, making them perfectly safe for sensitive skin, babies, and even pets." },
                      { icon: Clock, title: "Captures Every Detail", desc: "Our high-definition chromatic alginate formula replicates intricate fingerprints, jewelry details, and skin texture perfectly." },
                      { icon: Award, title: "Premium Quality", desc: "We use only museum-grade casting stone that is chip-resistant and stands the test of time, preserving your memory for generations." }
                  ].map((item, i) => (
                      <div key={i} className="glass p-8 hover:bg-white/40 transition-all duration-300 hover:scale-105 border-transparent hover:border-white/20">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                              <item.icon size={28} />
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 md:px-8 reveal-section">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Artisans</h2>
                  <p className="text-muted-foreground text-lg">The passionate team working behind the scenes.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {team.map((member, i) => (
                      <div key={i} className="group relative bg-card/50 rounded-2xl p-4 border border-border/50 hover:border-primary/20 transition-all duration-300">
                          <div className="aspect-[4/5] rounded-xl bg-muted overflow-hidden relative mb-6">
                              <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                 <Users className="w-20 h-20 text-muted-foreground/30" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                  <span className="text-white font-medium">Read Bio</span>
                              </div>
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                          <p className="text-primary font-medium mb-3">{member.role}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8 reveal-section">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-12 text-center rounded-3xl border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Ready to Create Your Masterpiece?</h2>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of happy families who have preserved their most precious memories with CastKeep.
                    </p>
                    <a href="/#product" className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1 active:translate-y-0">
                        Shop Experiences
                    </a>
                </div>
            </div>
          </div>
      </section>

      <Footer />
    </main>
  )
}
