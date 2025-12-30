"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CodeSnippetWithHtml } from "@/lib/code-snippets";
import { cn } from "@/lib/utils";

interface CodeShowcaseProps {
  snippets: CodeSnippetWithHtml[];
}

export function CodeShowcase({ snippets }: CodeShowcaseProps) {
  const [selectedId, setSelectedId] = useState(snippets[0]?.id || "");
  const [copied, setCopied] = useState(false);

  const currentSnippet =
    snippets.find((s) => s.id === selectedId) || snippets[0];

  const handleCopy = async () => {
    if (currentSnippet) {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Language Pills */}
      <div className="flex justify-center lg:justify-start">
        <div className="scrollbar-hide inline-flex overflow-x-auto rounded-full border border-border/40 bg-background/70 p-1 shadow-sm backdrop-blur">
          <ToggleGroup
            type="single"
            value={selectedId}
            onValueChange={(value) => value && setSelectedId(value)}
            className="flex gap-1"
          >
            {snippets.map((snippet) => (
              <ToggleGroupItem
                key={snippet.id}
                value={snippet.id}
                aria-label={`Switch to ${snippet.label}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-all",
                  "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
                  "data-[state=off]:text-muted-foreground hover:data-[state=off]:text-foreground"
                )}
              >
                {snippet.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {/* Code Card with Stage Background */}
      <div className="w-full rounded-[32px] bg-gradient-to-br from-indigo-200/80 via-sky-200/60 to-slate-200/80 p-4 ring-1 ring-border/40 sm:p-6">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background shadow-md">
          {/* Copy Button */}
          <div className="absolute right-3 top-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy code"
              className="h-8 w-8 hover:bg-muted/80"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Code Block */}
          <div
            className="h-[360px] overflow-auto p-4 font-mono text-sm leading-relaxed sm:h-[420px] sm:p-5"
            aria-label="Code snippet"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: currentSnippet.highlightedHtml,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
