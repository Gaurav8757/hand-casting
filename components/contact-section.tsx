"use client";

import ContactForm from "@/components/contact-form";
import { Phone, MessageCircle, Mail } from "lucide-react";

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
                Our team is ready to assist you with any inquiries about our 3D Hand Casting sessions, Custom Miniatures, or Resin Preservation services. Whether you want to book a session in Kolkata or order a gift online, Sayan and Sujay are just a message away.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground mb-4">Direct Support</h3>
              {/* Phone */}
              <a
                href="tel:+917003020846"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group shadow-2xl"
              >
                <div className="p-3 bg-accent/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Call Us (24/7 IST)
                  </h3>
                  <p className="text-foreground/70">+91 70030 20846</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    Speak directly with Sayan for bookings and consultations.
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/7003020846"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group shadow-2xl"
              >
                <div className="p-3 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
                  <MessageCircle className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    WhatsApp Support
                  </h3>
                  <p className="text-foreground/70">
                    Message us anytime for quick support or to send your reference photos.
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@bloodyboka.com"
                className="glass p-6 flex items-start gap-4 hover:bg-white/40 transition-all duration-300 group shadow-2xl"
              >
                <div className="p-3 bg-accent/20 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                  <p className="text-foreground/70">hello@bloodyboka.com</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    Response within 24 hours for corporate or custom orders.
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <ContactForm />
            
           
          </div>
        </div>
      </div>
    </section>
  );
}
