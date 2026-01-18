"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Login failed")
        return
      }

      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the admin dashboard to manage customer data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 000000-0000"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertCircle size={18} className="text-destructive shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button type="submit" className={`w-full ${isLoading ? "bg-slate-300 text-accent" : ""}`} disabled={isLoading}>
                {isLoading ? <Loader2 size={20} className=" animate-spin" /> : "Login"}
              </Button>
            </form>
            {/* <div className="mt-4 text-center text-sm text-foreground/70">
              {"Don't have an account? "}
              <Link href="/admin/register" className="text-secondary hover:underline underline-offset-4">
                Register
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
