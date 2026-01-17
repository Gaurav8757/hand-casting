"use client";

import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";


export default function ProductCarousel({ carouselImages }: { carouselImages: any }) {
  const router = useRouter();
 const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  return (
    <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 glass">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}>
        <CarouselContent>
          {carouselImages.map((item: any, index: number) => (
            <CarouselItem key={index}>
              <div onClick={() => router.push(item.slug)}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Bottom Info Box */}
      <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl max-w-xs">
        <p className="text-sm font-semibold text-foreground">Complete Kit Includes:</p>
        <ul className="text-xs text-foreground/70 space-y-1 mt-2">
          <li>✓ 1800g Premium Molding Powder</li>
          <li>✓ High-Grade Casting Stone</li>
          <li>✓ Professional Mixing Tools</li>
          <li>✓ Wooden Display Stand</li>
          <li>✓ Complete Instructions</li>
        </ul>
      </div>
    </div>
  );
}
