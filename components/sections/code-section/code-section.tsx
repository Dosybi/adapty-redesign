import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CodeShowcase } from "./code-showcase.client";
import { prepareCodeSnippets } from "@/lib/code-snippets";
import type { Code } from "@/lib/content.types";

interface CodeSectionProps {
  code: Code;
}

export async function CodeSection({ code }: CodeSectionProps) {
  const snippetsWithHtml = await prepareCodeSnippets(code.snippets);

  return (
    <Section
      className="border-y border-border/50 bg-slate-50"
      aria-labelledby="code-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Title & Description */}
            <div className="space-y-4">
              <h2
                id="code-title"
                className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              >
                {code.title}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {code.description}
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Button asChild size="lg" className="text-base font-semibold">
                <Link href={code.button.href}>{code.button.label}</Link>
              </Button>
            </div>

            {/* Testimonial Card */}
            <div className="rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
              {/* Logo */}
              <div className="mb-4">
                <Image
                  src={code.testimonial.logoSrc}
                  alt={`${code.testimonial.author} company logo`}
                  width={80}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>

              {/* Quote */}
              <blockquote className="space-y-4">
                <p className="text-base leading-relaxed text-foreground/90">
                  &ldquo;{code.testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <footer className="flex items-center gap-3">
                  <Image
                    src={code.testimonial.avatarSrc}
                    alt={code.testimonial.author}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-foreground">
                      {code.testimonial.author}
                    </div>
                    <div className="text-muted-foreground">
                      {code.testimonial.role}
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Right Column - Code Showcase */}
          <div className="flex min-w-0 items-center">
            <CodeShowcase snippets={snippetsWithHtml} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
