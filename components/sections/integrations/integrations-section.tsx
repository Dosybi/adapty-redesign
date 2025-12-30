import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { IntegrationTestimonial } from "./integration-testimonial";
import { IntegrationsGrid } from "./integrations-grid";
import type { Integrations } from "@/lib/content.types";

interface IntegrationsSectionProps {
  integrations: Integrations;
}

export function IntegrationsSection({
  integrations,
}: IntegrationsSectionProps) {
  return (
    <Section className="bg-background" aria-labelledby="integrations-title">
      <Container>
        {/* Top: 2 columns - Content & Testimonial */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left: Title, Description, CTA */}
          <div className="lg:col-span-7">
            <h2
              id="integrations-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {integrations.title}
            </h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
              {integrations.description}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link
                href={integrations.cta.href}
                className="inline-flex items-center gap-2"
              >
                {integrations.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right: Testimonial */}
          <div className="lg:col-span-5">
            <IntegrationTestimonial testimonial={integrations.testimonial} />
          </div>
        </div>

        {/* Bottom: Logo Grid */}
        <IntegrationsGrid items={integrations.items} />
      </Container>
    </Section>
  );
}
