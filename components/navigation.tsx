"use client"

import { useState } from "react"
import { Menu, X, Mail, LogIn } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile();
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`)
      setIsOpen(false)
      return
    }
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="glass mx-4 my-4 md:mx-8 md:my-6 px-6 py-4  bg-linear-to-b from-transparent to-muted/20">
        <div className="flex items-center  justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
              <Image src={"/logo.svg"} width={isMobile? 100: 140} height={isMobile? 100: 140} alt="Bloody Boka" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold tracking-wider">
            <button
              onClick={() => scrollToSection("product")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Shop
            </button>
            {/* <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-foreground hover:text-accent transition-colors"
            >
              How It Works
            </button> */}
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Reviews
            </button>
            
                <Link href="/about-us"
              className="text-foreground hover:text-accent transition-colors"
            >
              About Us
            </Link>
                  <Link href="/blogs"
              className="text-foreground hover:text-accent transition-colors"
            >
              Blogs
            </Link>
            
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
              className="glass hidden md:flex px-6 py-2 text-accent bg-white/40 hover:bg-white transition-all items-center gap-2"
            >
              <Mail size={18} />
              Contact Us
            </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden btn-primary" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              onClick={() => scrollToSection("product")}
              className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              Reviews
            </button>
               <Link href="/about-us"
             className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              About Us
            </Link>
                  <Link href="/blogs"
                className="block w-full text-left px-4 py-2 hover:text-accent hover:bg-secondary/20 rounded-lg transition-colors"
            >
              Blogs
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
             className="glass px-6 py-2 text-accent hover:bg-white/60 transition-all flex items-center gap-2"
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
