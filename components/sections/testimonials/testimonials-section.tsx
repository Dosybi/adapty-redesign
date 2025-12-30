import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonials } from "@/lib/content.types";

interface TestimonialsSectionProps {
  testimonials: Testimonials;
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <Section className="bg-slate-700" aria-labelledby="testimonials-title">
      <Container>
        {/* Title */}
        <h2
          id="testimonials-title"
          className="mb-12 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:mb-16 lg:text-left lg:text-5xl"
        >
          {testimonials.title}
        </h2>

        {/* Masonry Grid */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-2">
          {testimonials.items.map((item, index) => (
            <TestimonialCard key={index} testimonial={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
