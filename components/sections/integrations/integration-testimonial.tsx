import Image from "next/image";
import type { Testimonial } from "@/lib/content.types";

interface IntegrationTestimonialProps {
  testimonial: Testimonial;
}

export function IntegrationTestimonial({
  testimonial,
}: IntegrationTestimonialProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src={testimonial.logoSrc}
          alt={`${testimonial.author} company logo`}
          width={80}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </div>

      {/* Quote */}
      <blockquote className="space-y-4">
        <p className="text-base leading-relaxed text-foreground/90">
          {testimonial.quote}
        </p>

        {/* Author */}
        <footer className="flex items-center gap-3">
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.author}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-sm">
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
