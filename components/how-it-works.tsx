"use client";

import { Droplet, Hand, Beaker, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Droplet,
      title: "Prep",
      desc: "Mix molding powder with room-temperature water until smooth",
    },
    {
      icon: Hand,
      title: "Dip",
      desc: "Submerge hands and hold still for 2–5 minutes until mold sets",
    },
    {
      icon: Beaker,
      title: "Pour",
      desc: "Mix casting powder and pour into negative mold, tapping to remove bubbles",
    },
    {
      icon: Sparkles,
      title: "Reveal",
      desc: "Peel away alginate after 3–4 hours to reveal beautiful 3D sculpture",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Simple steps to create lasting memories
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative">
                <div className="glass p-6 text-center space-y-4 h-full">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center shadow-2xl justify-center mx-auto">
                    <Icon className="text-foreground" size={32} />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-accent/20 rounded-full text-xs font-semibold text-accent mb-2">
                      Step {i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mt-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-linear-to-r from-accent to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
