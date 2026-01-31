"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Star } from "lucide-react";

export default function Gallery() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [filter, setFilter] = useState("all");
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  async function fetchGalleryItems() {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("display_on_landing", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleries(data || []);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    { id: "all", label: "All Works" },
    { id: "couples", label: "Couples" },
    { id: "families", label: "Families" },
    { id: "babies", label: "Baby Molds" },
    { id: "custom", label: "Custom" },
  ];

  const filtered =
    filter === "all"
      ? galleries
      : galleries.filter((g) => g.category === filter);

  if (loading) {
    return (
      <section id="gallery" className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-foreground/60">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Gallery
          </h2>
          <p className="text-lg text-foreground/70">
            Our Best Handcrafted Personalized Gifts
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === cat.id
                  ? "bg-primary text-foreground"
                  : "glass text-foreground hover:bg-white/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group glass overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                {/* Rating display */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(item.rating)
                          ? "fill-accent text-accent"
                          : "text-foreground/30"
                      }
                    />
                  ))}
                  <span className="text-xs text-foreground/60 ml-1">
                    {item.rating}
                  </span>
                </div>

                {/* Customer Name */}
                {item.customer_name && (
                  <p className="text-xs font-medium text-foreground/80">
                    {item.customer_name}
                  </p>
                )}

                {/* Customer Review */}
                {item.customer_review && (
                  <p className="text-xs text-foreground/60 line-clamp-2 italic">
                    "{item.customer_review}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Gallery Items Found */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">
              No gallery items found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
