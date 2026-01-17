"use client";

import { Check } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Image from "next/image";
// 🔥 Dynamic data stored outside

export const productTabs = [
  {
    value: "features",
    label: "Features",
    content: "features", // This tells component to load features array
  },
  {
    value: "details",
    label: "Details",
    content: (
      <div className="space-y-3">
        <p className="text-foreground/70 text-sm leading-relaxed">
          Create memorable 3D hand casting sculptures with premium materials.
        </p>
        <p className="text-foreground/70 text-sm leading-relaxed">
          Safe, non-toxic, perfect for gifts & milestone celebrations.
        </p>
      </div>
    ),
  },
  {
    value: "kit",
    label: "What's Inside",
    content: (
      <ul className="text-sm text-foreground/80 space-y-2">
        <li>✓ 1800g Premium Molding Powder</li>
        <li>✓ High-Grade Casting Stone</li>
        <li>✓ Wooden Display Base</li>
        <li>✓ Gloves & Bucket</li>
        <li>✓ Precision Tools</li>
        <li>✓ Finishing Sandpaper</li>
      </ul>
    ),
  },
];

export const featureList = [
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


export default function ProductShowcase() {
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

        {/* TABS */}
        <Tabs defaultValue="features" className="w-full h-full">
          <TabsList className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full h-full overflow-y-auto p-5">
            {featureList.map((feature, i) => (
    <TabsTrigger
  key={i}
  value={feature.title}
  className="glass w-full p-5 hover:bg-white/50 transition-all flex items-center gap-4 rounded-xl shadow-2xl text-left"
>
  {/* FIXED ICON WRAPPER */}
  <div className="min-w-10 min-h-10 max-w-10 max-h-10 flex items-center justify-center rounded-full bg-lime-300/80 border border-lime-400 shadow-sm">
    <Check size={18} className="text-foreground" strokeWidth={2.5} />
  </div>

  {/* TEXT */}
  <div className="flex flex-col">
    <h3 className="font-semibold text-foreground leading-tight">
      {feature.title}
    </h3>
    <p className="text-sm text-foreground/70 leading-snug">
      {feature.desc}
    </p>
  </div>
</TabsTrigger>


            ))}
          </TabsList>

          {featureList.map((feature, i) => (
            <TabsContent
              key={i}
              value={feature.title}
              className="w-full h-full pt-6"
            >
              <div className="glass p-8 rounded-xl shadow-xl grid md:grid-cols-2 gap-8 items-center  bg-primary/5">

                {/* LEFT — Image */}
                <div className="flex items-center justify-center">
                  <Image
                    src={`/images/inside/inside-${i + 1}.png`}
                    alt={feature.title}
                    width={450}
                    height={450}
                    className="rounded-xl object-cover"
                  />
                </div>

                {/* RIGHT — Text Details */}
                <div className="space-y-4 p-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="text-foreground/70 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                  <p className="text-foreground/60 text-sm">
                    Create detailed, professional-quality molds with our premium kit.
                  </p>
                </div>

              </div>
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </section>
  );
}
