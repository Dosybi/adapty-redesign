import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Help, HelpItem } from "@/lib/content.types";
import { cn } from "@/lib/utils";

interface HelpSectionProps {
  help: Help;
}

interface HelpCardLinkProps {
  item: HelpItem;
}

function HelpCardLink({ item }: HelpCardLinkProps) {
  return (
    <Link
      href={item.button.href}
      aria-label={item.button.label}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border/40 bg-background",
        "shadow-sm transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-border/70 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.imageSrc}
          alt={item.button.label}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Button/Title with Arrow */}
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">
            {item.button.label}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Bullets as Chips */}
        <div className="flex flex-wrap gap-2">
          {item.bullets.map((bullet, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-normal"
            >
              {bullet}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function HelpSection({ help }: HelpSectionProps) {
  return (
    <Section className="border-y border-border/40 bg-muted/20">
      <Container>
        <div className="space-y-12 lg:space-y-16">
          {/* Title */}
          <h2 className="mx-auto max-w-3xl text-center text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {help.title}
          </h2>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {help.items.map((item, index) => (
              <HelpCardLink key={index} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
