import { loadHomeContent } from "@/lib/content";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { HelpSection } from "@/components/sections/HelpSection";
import { SlaSection } from "@/components/sections/SlaSection";
import { CodeSection } from "@/components/sections/code-section/code-section";

export default async function MarketingPage() {
  const content = loadHomeContent();

  return (
    <main>
      <HeroSection hero={content.hero} />
      {content.trustedBy && <TrustedBySection trustedBy={content.trustedBy} />}
      {content.help && <HelpSection help={content.help} />}
      {content.sla && <SlaSection sla={content.sla} />}
      {content.code && <CodeSection code={content.code} />}
    </main>
  );
}
