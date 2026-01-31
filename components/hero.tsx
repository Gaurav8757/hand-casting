"use client";

import { ChevronDown } from "lucide-react";

const services = ["3D Hand Casting", "Resin Art", "String Art", "Custom Frames"];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-primary font-semibold">Personalized Gifts in Kolkata</p>
          <h1 className="text-5xl md:text-7xl font-bold text-balance">
            <span className="text-primary">Premium Memory</span>
            <br />
            <span className="text-foreground">Preservation & Handcrafted Gifts</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 text-balance max-w-2xl mx-auto">
            We don't just frame memories; we immortalize them. From 3D Wedding Miniatures to Lifelike Hand Casting, we turn your fleeting moments into timeless art.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <button className="px-8 py-4 bg-primary text-foreground font-semibold rounded-full hover:shadow-lg active:scale-95 transition-all duration-200">
            Get Started • ₹99
          </button>
          <button className="glass px-8 py-4 text-primary font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200">
            See How It Works
          </button>
        </div>

        {/* Services */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {services.map((service, i) => (
              <div key={i} className="text-sm md:text-base text-foreground/70 font-medium">
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="pt-12 animate-bounce">
          <ChevronDown className="mx-auto text-primary" size={32} />
        </div>
      </div>
    </section>
  );
}
