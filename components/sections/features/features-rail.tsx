import { Section } from "@/components/layout/section";
import { FeatureCard } from "./feature-card";
import { RailControls } from "./rail-controls.client";
import type { Features } from "@/lib/content.types";

interface FeaturesRailProps {
  features: Features;
}

export function FeaturesRail({ features }: FeaturesRailProps) {
  return (
    <Section className="bg-background" aria-labelledby="features-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2
          id="features-title"
          className="mb-8 text-center text-4xl font-semibold tracking-tight lg:text-5xl"
        >
          {features.title}
        </h2>
      </div>

      {/* Horizontal Rail - Extends to screen edge */}
      <div
        id="features-rail"
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          paddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 2rem))",
        }}
      >
        {features.items.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
        <div className="w-8 flex-shrink-0" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Controls */}
        <RailControls />
      </div>
    </Section>
  );
}
