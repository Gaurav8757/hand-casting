"use client";

import { Check } from "lucide-react";

export default function ProductShowcase() {
  const features = [
    {
      title: "1800g Molding Powder",
      desc: "Create detailed, professional-quality molds",
    },
    {
      title: "Casting Stone",
      desc: "Mix to create beautiful, lasting sculptures",
    },
    {
      title: "Premium Tools",
      desc: "Precision sticks and detailing instruments",
    },
    { title: "Bucket & Gloves", desc: "Everything needed for clean casting" },
    {
      title: "Sandpaper & Finishers",
      desc: "Polish and refine your final sculpture",
    },
    {
      title: "Wooden Base",
      desc: "Display-ready with optional personalized engraving",
    },
  ];

  return (
    <section id="product" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            What's Inside
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything you need to create beautiful hand cast sculptures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass p-6 space-y-3 hover:bg-white/40 transition-all duration-300 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full font-bold bg-primary flex items-center justify-center shrink-0 mt-1">
                  <Check className="text-foreground" size={20} fontWeight={40}/>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-12 glass p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Specifications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">Weight:</span>{" "}
                1800g total
              </p>
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">
                  Mold Time:
                </span>{" "}
                2–5 minutes
              </p>
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">
                  Setting Time:
                </span>{" "}
                3–4 hours
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">
                  Certification:
                </span>{" "}
                Skin-Safe & Non-Toxic
              </p>
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">
                  Shelf Life:
                </span>{" "}
                2+ years
              </p>
              <p className="text-foreground/70">
                <span className="font-semibold text-foreground">
                  Suitable Age:
                </span>{" "}
                5+ years
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
