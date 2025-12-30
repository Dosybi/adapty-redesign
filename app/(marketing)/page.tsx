import { loadHomeContent } from "@/lib/content";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { HelpSection } from "@/components/sections/HelpSection";
import { SlaSection } from "@/components/sections/SlaSection";
import { CodeSection } from "@/components/sections/code-section/code-section";
import { FeaturesRail } from "@/components/sections/features/features-rail";
import { IntegrationsSection } from "@/components/sections/integrations/integrations-section";
import { EnterpriseSection } from "@/components/sections/enterprise/enterprise-section";
import { TestimonialsSection } from "@/components/sections/testimonials/testimonials-section";

export default async function MarketingPage() {
  const content = loadHomeContent();

  return (
    <main>
      <HeroSection hero={content.hero} />
      {content.trustedBy && <TrustedBySection trustedBy={content.trustedBy} />}
      {content.help && <HelpSection help={content.help} />}
      {content.sla && <SlaSection sla={content.sla} />}
      {content.code && <CodeSection code={content.code} />}
      {content.features && <FeaturesRail features={content.features} />}
      {content.integrations && (
        <IntegrationsSection integrations={content.integrations} />
      )}
      {content.testimonials && (
        <TestimonialsSection testimonials={content.testimonials} />
      )}
      {content.enterprise && (
        <EnterpriseSection enterprise={content.enterprise} />
      )}
    </main>
  );
}
