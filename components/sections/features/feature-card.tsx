import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Feature } from "@/lib/content.types";
import { FeatureTestimonial } from "./feature-testimonial";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  //   const tintClass = getTintClasses(index);

  return (
    <div className="w-[88vw] flex-shrink-0 snap-start sm:w-[70vw] lg:w-[min(920px,75vw)]">
      <div
        className={cn(
          "h-full overflow-hidden rounded-[28px] border border-border/40 bg-background p-6 shadow-sm transition-all duration-200 ease-out sm:p-8",
          "hover:shadow-md"
        )}
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Image Stage */}
          {/* <div
            className={cn(
              "order-1 rounded-[24px] bg-gradient-to-br p-4 ring-1 ring-border/30 lg:order-none",
              tintClass
            )}
          > */}
          <div className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={feature.imageSrc}
                alt={feature.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 88vw, 460px"
                loading="lazy"
              />
            </div>
            {/* </div> */}
          </div>

          {/* Right: Content */}
          <div className="order-2 space-y-6 lg:order-none">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {feature.description}
              </p>
            </div>

            {/* CTA Link */}
            <Link
              href={feature.cta.href}
              className="group inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-foreground/80"
            >
              {feature.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Testimonial (optional) */}
            {feature.testimonial && (
              <FeatureTestimonial testimonial={feature.testimonial} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
