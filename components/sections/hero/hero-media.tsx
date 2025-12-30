import Image from "next/image";
import type { MediaItem } from "@/lib/content.types";

interface HeroMediaProps {
  phone: MediaItem;
  dashboard: MediaItem;
}

export function HeroMedia({ phone, dashboard }: HeroMediaProps) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Dashboard - Main visual with subtle tilt */}
      <div className="relative lg:rotate-[2deg] lg:transform">
        <div className="relative overflow-hidden rounded-lg border border-border/40 bg-background shadow-2xl shadow-black/10 lg:rounded-xl">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={dashboard.src}
              alt={dashboard.alt || "Dashboard preview"}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Phone - Overlay positioned on top left */}
      <div className="absolute -bottom-8 left-4 w-[35%] max-w-[240px] sm:left-8 sm:w-[30%] lg:-bottom-12 lg:left-12 lg:w-[28%]">
        <div className="relative lg:-rotate-[3deg] lg:transform">
          <div className="relative overflow-hidden rounded-lg border border-border/40 bg-background shadow-2xl shadow-black/20 lg:rounded-xl">
            <div className="relative aspect-[9/19.5] w-full">
              <Image
                src={phone.src}
                alt={phone.alt || "Mobile app preview"}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 35vw, (max-width: 1024px) 30vw, 360px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
