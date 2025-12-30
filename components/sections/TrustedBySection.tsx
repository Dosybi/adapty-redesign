import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { TrustedBy } from "@/lib/content.types";
import { cn } from "@/lib/utils";

interface TrustedBySectionProps {
  trustedBy: TrustedBy;
}

interface LogoItemProps {
  logoSrc: string;
  alt?: string;
  label?: string;
  className?: string;
}

function LogoItem({ logoSrc, alt, label, className }: LogoItemProps) {
  const altText = alt ?? label ?? "Logo";

  return (
    <div
      className={cn(
        "flex h-12 items-center justify-center opacity-70 transition-opacity hover:opacity-100",
        className
      )}
    >
      <Image
        src={logoSrc}
        alt={altText}
        width={120}
        height={48}
        className="h-auto max-h-12 w-auto object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function TrustedBySection({ trustedBy }: TrustedBySectionProps) {
  return (
    <Section className="bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="space-y-10">
          {/* Title */}
          <h2 className="text-center text-sm font-normal text-muted-foreground sm:text-base">
            {trustedBy.title}
          </h2>

          {/* Logos - Desktop: horizontal flex, Mobile: horizontal scroll */}
          <div className="relative">
            {/* Desktop view */}
            <div className="hidden items-center justify-center gap-x-10 gap-y-6 md:flex md:flex-wrap lg:gap-x-12">
              {trustedBy.items.map((item, index) => (
                <LogoItem
                  key={index}
                  logoSrc={item.logoSrc}
                  alt={item.alt}
                  label={item.label}
                />
              ))}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="overflow-x-auto scrollbar-hide md:hidden">
              <div className="flex items-center gap-x-8 px-4">
                {trustedBy.items.map((item, index) => (
                  <LogoItem
                    key={index}
                    logoSrc={item.logoSrc}
                    alt={item.alt}
                    label={item.label}
                    className="flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
