import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Enterprise } from "@/lib/content.types";
import { EnterpriseColumn } from "./enterprise-column";

export function EnterpriseSection({ enterprise }: { enterprise: Enterprise }) {
  return (
    <Section aria-labelledby="enterprise-title">
      <Container>
        <h2
          id="enterprise-title"
          className="mb-12 text-center text-3xl font-bold sm:text-4xl lg:mb-16 lg:text-5xl"
        >
          {enterprise.title}
        </h2>

        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Вертикальные разделители между колонками на desktop */}
          <div className="absolute bottom-0 left-1/3 top-0 hidden w-px bg-border/40 lg:block" />
          <div className="absolute bottom-0 left-2/3 top-0 hidden w-px bg-border/40 lg:block" />

          {enterprise.columns.map((column, idx) => (
            <EnterpriseColumn key={idx} column={column} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
