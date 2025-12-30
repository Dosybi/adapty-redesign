import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialItem } from "@/lib/content.types";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="mb-6 break-inside-avoid border-border/10 bg-slate-500">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Avatar */}
          <div>
            <Image
              src={testimonial.avatarSrc}
              alt={testimonial.author}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>

          {/* Quote */}
          <p className="text-[15px] leading-6">{testimonial.quote}</p>

          {/* Footer: Author + Logo */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">
                {testimonial.author}
              </div>
              <div className="text-xs text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={testimonial.logoSrc}
                alt={`${testimonial.author} company logo`}
                width={80}
                height={24}
                className="h-5 w-auto object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
