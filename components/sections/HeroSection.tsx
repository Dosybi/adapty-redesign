import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroMedia } from "@/components/sections/hero/hero-media";
import type { Hero } from "@/lib/content.types";

interface HeroSectionProps {
  hero: Hero;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-muted/10 to-background">
      <Container>
        {/* Vertical Layout: Content on top, Media below */}
        <div className="space-y-16 lg:space-y-20">
          {/* Content Block - Centered/Left-aligned */}
          <div className="mx-auto max-w-3xl space-y-10 text-center lg:text-left">
            {/* Banner Pill */}
            {hero.banner && (
              <div className="flex justify-center lg:justify-start">
                <Link
                  href={hero.banner.link.href}
                  className="group inline-flex items-center gap-3 rounded-full border border-border/50 bg-background/80 px-3 py-1.5 pr-1.5 text-sm shadow-sm backdrop-blur-md transition-all hover:border-border/80 hover:bg-background hover:shadow-md"
                >
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm"
                  >
                    {hero.banner.mark}
                  </Badge>
                  <span className="text-sm font-medium tracking-tight text-foreground">
                    {hero.banner.link.label}
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/5 transition-all group-hover:bg-foreground/10 group-hover:shadow-sm">
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>
            )}

            {/* Title */}
            <div className="space-y-6">
              <h1
                id="hero-title"
                className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                {hero.title}
              </h1>

              {/* Subtitle */}
              {hero.subtitle && (
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
                  {hero.subtitle}
                </p>
              )}
            </div>

            {/* CTA Block - Single line on desktop */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              {/* Email Input + Primary CTA Group */}
              <div className="flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
                <Input
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  className="h-12 w-full border-border/60 bg-background/50 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-muted-foreground/60 focus-visible:border-border focus-visible:shadow-md focus-visible:ring-1 sm:w-64"
                />
                {hero.primaryCta && (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 whitespace-nowrap px-8 text-base font-semibold shadow-md transition-all hover:shadow-lg"
                  >
                    <Link href={hero.primaryCta.href}>
                      {hero.primaryCta.label}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Secondary CTA - Same line on desktop */}
              {hero.secondaryCta && (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-12 text-base font-medium text-foreground/80 transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <Link href={hero.secondaryCta.href}>
                    {hero.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Media Composition - Below content */}
          {hero.media && hero.media.length >= 2 && (
            <HeroMedia phone={hero.media[0]} dashboard={hero.media[1]} />
          )}
        </div>
      </Container>
    </Section>
  );
}
