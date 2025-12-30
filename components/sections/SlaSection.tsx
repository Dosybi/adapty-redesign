import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Sla, SlaMetric as SlaMetricType } from "@/lib/content.types";

interface SlaSectionProps {
  sla: Sla;
}

interface SlaMetricProps {
  metric: SlaMetricType;
}

function SlaMetric({ metric }: SlaMetricProps) {
  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <dd className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {metric.amount}
      </dd>
      <dt className="text-sm text-muted-foreground sm:text-base">
        {metric.description}
      </dt>
    </div>
  );
}

export function SlaSection({ sla }: SlaSectionProps) {
  return (
    <Section className="bg-muted/20" aria-labelledby="sla-title">
      <Container>
        <div className="space-y-12 lg:space-y-16">
          {/* Title */}
          <h2
            id="sla-title"
            className="mx-auto max-w-4xl text-center text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
          >
            {sla.title}
          </h2>

          {/* Metrics Grid */}
          <dl className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-16">
            {sla.items.map((metric, index) => (
              <SlaMetric key={index} metric={metric} />
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
