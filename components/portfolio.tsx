"use client";

import { useState } from "react";
import BeforeAfterSlider from "@/components/before-after-slider";

const portfolioItems = [
  {
    id: 1,
    title: "Ornate Garden Fixture",
    category: "Decorative",
    before: "/rough-cast-metal-garden-ornament.jpg",
    after: "/polished-ornate-garden-casting-detail.jpg",
  },
  {
    id: 2,
    title: "Custom Door Handles",
    category: "Functional",
    before: "/raw-cast-door-handle.jpg",
    after: "/finished-brass-door-handle.jpg",
  },
  {
    id: 3,
    title: "Architectural Elements",
    category: "Architectural",
    before: "/cast-metal-architectural-piece-raw.jpg",
    after: "/finished-metal-architectural-detail.jpg",
  },
  {
    id: 4,
    title: "Sculptural Pieces",
    category: "Art",
    before: "/raw-metal-sculpture.jpg",
    after: "/polished-artistic-metal-sculpture.jpg",
  },
];

const categories = ["All", "Decorative", "Functional", "Architectural", "Art"];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Our <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore our collection of hand-cast works, from raw material to
            finished masterpiece
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "glass bg-white/20 text-primary"
                  : "glass hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="glass p-0 overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <BeforeAfterSlider
                  before={item.before}
                  after={item.after}
                  title={item.title}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-primary text-sm font-medium mt-1">
                    {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
