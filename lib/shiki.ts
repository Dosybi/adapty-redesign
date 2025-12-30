import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light"],
      langs: ["swift", "kotlin", "javascript", "dart", "csharp"],
    });
  }
  return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: "github-light",
  });
}
