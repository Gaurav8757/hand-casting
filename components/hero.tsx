"use client";

import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-balance">
            <span className="text-primary">Timeless Hand-Cast</span>
            <br />
            <span className="text-foreground">Masterpieces</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 text-balance max-w-2xl mx-auto">
            Discover exceptional hand-casting artistry. Each piece is crafted
            with precision, passion, and decades of expertise.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <button className="glass px-8 py-4 text-primary font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200">
            View Portfolio
          </button>
          <button className="px-8 py-4 bg-primary text-foreground font-semibold rounded-full hover:shadow-lg active:scale-95 transition-all duration-200">
            Get Started
          </button>
        </div>

        {/* Animated scroll indicator */}
        <div className="pt-12 animate-bounce">
          <ChevronDown className="mx-auto text-primary" size={32} />
        </div>
      </div>
    </section>
  );
}
