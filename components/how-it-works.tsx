"use client";

import { MessageSquare, Users, Sparkles, Package } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Share Your Vision",
      desc: "Pick your product and tell us your story via our form or WhatsApp.",
    },
    {
      icon: Users,
      title: "Expert Consultation",
      desc: "We will personally chat with you to finalize every tiny detail.",
    },
    {
      icon: Sparkles,
      title: "Handcrafting the Magic",
      desc: "We get to work, meticulously crafting your memory into a handmade masterpiece.",
    },
    {
      icon: Package,
      title: "Delivered with Love",
      desc: "Your art is packed with care and shipped safely to your doorstep.",
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
