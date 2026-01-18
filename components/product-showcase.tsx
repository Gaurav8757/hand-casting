"use client";

import { Check } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface ProductFeature {
  id: string;
  title: string;
  description: string;
  detailed_description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export default function ProductShowcase() {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error("Error fetching product features:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
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
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) {
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
          <div className="text-center py-20 text-foreground/50">
            No features available at the moment.
          </div>
        </div>
      </section>
    );
  }

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
        <Tabs defaultValue={features[0]?.title} className="w-full h-full">
          <TabsList className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full h-full overflow-y-auto p-5">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.title}
                className="glass w-full p-5 hover:bg-white/50 transition-all flex items-center gap-4 rounded-xl shadow-2xl text-left">
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
                    {feature.description}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent
              key={feature.id}
              value={feature.title}
              className="w-full h-full pt-6">
              <div className="glass p-8 rounded-xl shadow-xl grid md:grid-cols-2 gap-8 items-center bg-primary/5">

                {/* LEFT — Image */}
                <div className="flex items-center justify-center">
                  {feature.image_url ? (
                    <img
                      src={feature.image_url}
                      alt={feature.title}
                      width={450}
                      height={450}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-[450px] h-[450px] bg-white/5 rounded-xl flex items-center justify-center text-foreground/30">
                      No image
                    </div>
                  )}
                </div>

                {/* RIGHT — Text Details */}
                <div className="space-y-4 p-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="text-foreground/70 text-base leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.detailed_description && (
                    <p className="text-foreground/60 text-sm">
                      {feature.detailed_description}
                    </p>
                  )}
                </div>

              </div>
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </section>
  );
}
