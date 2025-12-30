import { loadHomeContent } from "@/lib/content";
import { HeroSection } from "@/components/sections/HeroSection";

export default function MarketingPage() {
  const content = loadHomeContent();

  return (
    <main>
      <HeroSection hero={content.hero} />
    </main>
  );
}
