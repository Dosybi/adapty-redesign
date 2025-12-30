import { Badge } from "@/components/ui/badge";
import { EnterpriseColumn as EnterpriseColumnType } from "@/lib/content.types";

export function EnterpriseColumn({ column }: { column: EnterpriseColumnType }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{column.title}</h3>
      <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {column.items.map((item, idx) => {
          if (item.emphasis === "underline") {
            return (
              <p key={idx}>
                <span className="text-foreground underline decoration-border/70 underline-offset-4">
                  {item.text}
                </span>
              </p>
            );
          }

          if (item.emphasis === "bold") {
            return (
              <p key={idx} className="font-medium text-foreground">
                {item.text}
              </p>
            );
          }

          if (item.emphasis === "pill") {
            return (
              <div key={idx}>
                <Badge variant="secondary" className="text-xs">
                  {item.text}
                </Badge>
              </div>
            );
          }

          return <p key={idx}>{item.text}</p>;
        })}
      </div>
    </div>
  );
}
