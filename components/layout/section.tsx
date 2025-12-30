import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}

export function Section({
  children,
  className,
  id,
  "aria-labelledby": ariaLabelledby,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("py-16 sm:py-24 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
