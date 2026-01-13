"use client"

import type React from "react"

import { useState, useRef } from "react"

interface BeforeAfterSliderProps {
  before: string
  after: string
  title: string
}

export default function BeforeAfterSlider({ before, after, title }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, newPosition)))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, newPosition)))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 md:h-96 overflow-hidden cursor-col-resize group bg-muted"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image */}
      <img
        src={after || "/placeholder.svg"}
        alt={`${title} - After`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={before || "/placeholder.svg"}
          alt={`${title} - Before`}
          className="w-screen h-full object-cover"
          style={{ width: `${100 / (position / 100) || 100}%` }}
        />
      </div>

      {/* Slider Handle */}
      <div className="absolute top-0 bottom-0 w-1 bg-white/50 transition-all" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-0.5 h-6 bg-foreground/50" />
            <div className="w-0.5 h-6 bg-foreground/50" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 glass px-3 py-1 text-xs font-semibold text-foreground">Before</div>
      <div className="absolute top-4 right-4 glass px-3 py-1 text-xs font-semibold text-foreground">After</div>
    </div>
  )
}
