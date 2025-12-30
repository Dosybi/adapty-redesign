import Image from "next/image";
import type { Testimonial } from "@/lib/content.types";

interface FeatureTestimonialProps {
  testimonial: Testimonial;
}

export function FeatureTestimonial({ testimonial }: FeatureTestimonialProps) {
  return (
    <div className="mt-6 rounded-2xl border border-border/40 bg-muted/20 p-5">
      {/* Logo */}
      <div className="mb-3">
        <Image
          src={testimonial.logoSrc}
          alt={`${testimonial.author} company logo`}
          width={80}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </div>

      {/* Quote */}
      <blockquote className="space-y-3">
        <p className="line-clamp-4 text-sm leading-relaxed text-foreground/90">
          {testimonial.quote}
        </p>

        {/* Author */}
        <footer className="flex items-center gap-2">
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.author}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="text-xs">
            <div className="font-medium text-foreground">
              {testimonial.author}
            </div>
            <div className="text-muted-foreground">{testimonial.role}</div>
          </div>
        </footer>
      </blockquote>
    </div>
  );
}
