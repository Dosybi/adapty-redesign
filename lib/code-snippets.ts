import { highlight } from "./shiki";
import type { CodeSnippet } from "./content.types";

export interface CodeSnippetWithHtml extends CodeSnippet {
  highlightedHtml: string;
}

export async function prepareCodeSnippets(
  snippets: CodeSnippet[]
): Promise<CodeSnippetWithHtml[]> {
  return Promise.all(
    snippets.map(async (snippet) => ({
      ...snippet,
      highlightedHtml: await highlight(snippet.code, snippet.language),
    }))
  );
}
