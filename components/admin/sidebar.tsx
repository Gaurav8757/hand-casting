"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Users, 
  Eye, 
  Image as ImageIcon, 
  Star, 
  LogOut,
  PlusCircle,
  Menu, 
  X, 
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Analytics",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Submissions",
    href: "/admin/dashboard/submissions",
    icon: Users,
  },
  {
    title: "Visits",
    href: "/admin/dashboard/visits",
    icon: Eye,
  },
  {
    title: "Data Entry",
    href: "/admin/dashboard/data-entry",
    icon: PlusCircle,
  },
  {
    title: "Gallery",
    href: "/admin/dashboard/gallery",
    icon: ImageIcon,
  },
  {
    title: "Reviews",
    href: "/admin/dashboard/reviews",
    icon: Star,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-primary" size={24} />
          <span className="font-bold text-xl">CastKeep</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-card border-r w-64 transform transition-transform duration-200 ease-in-out z-50 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 hidden lg:flex items-center gap-2 border-b">
            <LayoutDashboard className="text-primary" size={28} />
            <span className="font-bold text-2xl">CastKeep</span>
          </div>

          <div className="p-4 flex-1">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-accent/50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" 
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut size={18} />
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
