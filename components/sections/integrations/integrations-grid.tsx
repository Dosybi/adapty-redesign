import { LogoTile } from "@/components/shared/logo-tile";
import type { IntegrationItem } from "@/lib/content.types";

interface IntegrationsGridProps {
  items: IntegrationItem[];
}

export function IntegrationsGrid({ items }: IntegrationsGridProps) {
  return (
    <div className="mt-10 sm:mt-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item, index) => (
          <LogoTile key={index} logoSrc={item.logoSrc} alt={item.alt} />
        ))}
      </div>
    </div>
  );
}
