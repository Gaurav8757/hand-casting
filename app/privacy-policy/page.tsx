"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"
import { Shield, Lock, Users, Mail } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background overflow-hidden font-sans">
      <VisitorTracker />
      <div className="gradient-mesh" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-foreground/70">
              At Bloody Boka, we respect your privacy as much as we value your memories. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Sections */}
      <section className="pt-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Information We Collect */}
          <div className="glass p-8 rounded-2xl border border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <Users className="text-primary mt-1 shrink-0" size={28} />
              <div className="w-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-foreground/70 mb-4">
                  We only collect information that is essential for fulfilling your orders:
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Personal Identity:</strong> Name, email address, phone number, and shipping address.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Customization Assets:</strong> Photographs, voice notes, or personal stories shared for creating custom 3D miniatures, string art, or resin keepsakes.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Data */}
          <div className="glass p-8 rounded-2xl border border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="text-primary mt-1 shrink-0" size={28} />
              <div className="w-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Data</h2>
                <p className="text-foreground/70 mb-4">
                  The data you provide to Bloody Boka is used strictly for:
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Order Fulfillment:</strong> Processing your payments and crafting your custom art pieces.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Communication:</strong> Sending order updates and responding to your inquiries.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Service Improvement:</strong> Improving our website experience and offering personalized gift recommendations.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Image & Memory Protection */}
          <div className="glass p-8 rounded-2xl border border-accent/20 bg-accent/2">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="text-accent mt-1 shrink-0" size={28} />
              <div className="w-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Image & Memory Protection (Strict Confidentiality)</h2>
                <p className="text-foreground/70 mb-4">
                  We understand that the photos you send for 3D modeling or hand-casting are personal.
                </p>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Limited Access:</strong> Only the partners, Sayan Ghosh and Sujay Jaguliya, have access to your reference photos.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>No Unauthorized Use:</strong> We will never post your personal photos, 3D miniatures, or hand-casting videos on social media or for marketing purposes without your explicit written consent.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third-Party Sharing */}
          <div className="glass p-8 rounded-2xl border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party Sharing</h2>
            <p className="text-foreground/70">
              We do not sell, trade, or rent your personal information to others. We only share necessary details (Name and Address) with our trusted courier partners to ensure your order reaches your doorstep in Kolkata or across India.
            </p>
          </div>

          {/* Security */}
          <div className="glass p-8 rounded-2xl border border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <Lock className="text-primary mt-1 shrink-0" size={28} />
              <div className="w-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Security</h2>
                <p className="text-foreground/70">
                  We implement industry-standard security measures to protect your data. All online payments are processed through secure, encrypted gateways. We do not store your credit card or bank details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto glass p-8 rounded-2xl border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-foreground/70 mb-6">
            If you have any questions regarding your privacy or wish to delete your data from our records, please contact us at:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:hello@bloodyboka.com"
              className="px-6 py-3 bg-primary text-foreground font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Mail size={20} />
              hello@bloodyboka.com
            </a>
            <a
              href="https://wa.me/7003020846"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
