"use client"

import { useState } from "react"
import { Menu, X, Mail, LogIn } from "lucide-react"
import Link from "next/link"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="glass mx-4 my-4 md:mx-8 md:my-6 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full" />
            <div className="text-xl font-bold text-foreground">CastKeep</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-sm">
            <button
              onClick={() => scrollToSection("product")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Reviews
            </button>
            
            {/* <div className="flex gap-3 items-center border-l pl-8 border-white/20">
          
             <Link
                href="/admin/login"
                className="px-4 py-2 text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                href="/admin/register"
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium"
              >
                Admin
              </Link> 
            </div>*/}
          </div>

            <button
              onClick={() => scrollToSection("contact")}
              className="glass px-6 py-2 text-primary hover:bg-white/40 transition-all flex items-center gap-2"
            >
              <Mail size={18} />
              Contact Us
            </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              onClick={() => scrollToSection("product")}
              className="block w-full text-left px-4 py-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-4 py-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left px-4 py-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left px-4 py-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("contact")}
             className="glass px-6 py-2 text-primary hover:bg-white/40 transition-all flex items-center gap-2"
            >
              Contact Us
            </button>
            {/* <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
              <Link
                href="/admin/login"
                className="block px-4 py-2 text-foreground hover:bg-white/20 rounded-lg transition-colors"
              >
                Admin Login
              </Link>
              <Link
                href="/admin/register"
                className="block px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all font-medium text-center"
              >
                Admin Register
              </Link>
            </div> */}
          </div>
        )}
      </div>
    </nav>
  )
}
