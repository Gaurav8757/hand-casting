"use client"

import ContactForm from "@/components/contact-form"
import { Phone, MessageCircle, Mail, Truck } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4 text-foreground">
                Have a Question?
                <span className="text-accent"> We're Here to Help</span>
              </h2>
              <p className="text-foreground/70 text-lg">
                Our team is ready to assist with any questions about your CastKeep hand casting kit.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+917003020846"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="p-3 bg-accent/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                  <p className="text-foreground/70">+91 70030 20846</p>
                  <p className="text-xs text-foreground/60 mt-1">24*7  IST</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/7003020846"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                  <MessageCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                  <p className="text-foreground/70">Message us anytime for quick support</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@castkeep.com"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="p-3 bg-accent/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-foreground/70">support@castkeep.com</p>
                  <p className="text-xs text-foreground/60 mt-1">Response within 24 hours</p>
                </div>
              </a>

              {/* Shipping */}
              <div className="glass p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <Truck className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Fast Shipping</h3>
                  <p className="text-foreground/70">Orders ship within 24 hours</p>
                  <p className="text-xs text-foreground/60 mt-1">Free shipping over ₹75</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
