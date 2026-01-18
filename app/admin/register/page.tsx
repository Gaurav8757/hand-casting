"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2, ShieldAlert } from "lucide-react"

export default function AdminRegisterPage() {
  const [name, setName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationDisabled, setRegistrationDisabled] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if registration is allowed
    checkRegistrationStatus()
  }, [])

  async function checkRegistrationStatus() {
    try {
      const response = await fetch("/api/admin/register", {
        method: "HEAD",
      })
      // If we get 403, registration is disabled
      setRegistrationDisabled(response.status === 403)
    } catch (err) {
      console.error("Error checking registration status:", err)
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Registration failed")
        return
      }

      router.push("/admin/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (registrationDisabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-center">Registration Disabled</CardTitle>
            <CardDescription className="text-center">
              Admin registration is currently disabled. An admin account already exists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Link href="/admin/login">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Registration</CardTitle>
          <CardDescription>Create a new admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                placeholder="Enter your password again"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className={`w-full ${isLoading ? "bg-slate-300 text-accent" : ""}`} disabled={isLoading}>
              {isLoading ? <Loader2 size={20} className=" animate-spin" /> : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/admin/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
