import { SNIPPET_FILES } from "./content.generated";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";
import rehypeHighlight from 'rehype-highlight';
import {rehype} from 'rehype';

export type Snippet = {
  slug: string;
  title: string;
  desc: number;
  date: string;
  icon: string;
};

export type SnippetMarkdownAttributes = {
  slug: string;
  title: string;
  desc: number;
  date: string;
  icon: string;
};

// Snippets are baked into the server build by scripts/build-content.mjs (see that file for why).
function readSnippet(filename: string): string {
  const file = SNIPPET_FILES[filename];
  if (file === undefined) throw new Error(`ENOENT: no such snippet: ${filename}`);
  return file;
}

function isValidSnippetAttributes(
  attributes: any
): attributes is SnippetMarkdownAttributes {
  return attributes?.title;
}

export async function getSnippets() {
  const dir = Object.keys(SNIPPET_FILES);
  return Promise.all(
    dir.map(async (filename) => {
      const file = readSnippet(filename);
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidSnippetAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
        desc: attributes.desc,
        icon: attributes.icon,
      };
    })
  );
}

export async function getSnippet(slug: string) {
  const filepath = slug + ".md";
  const file = readSnippet(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidSnippetAttributes(attributes),
    `Snippet ${filepath} is missing attributes`
  );
  const html = await rehype()
  .data('settings', {fragment: true})
  .use(rehypeHighlight)
  .process(marked(body))

  return {
    slug,
    html: html.value,
    title: attributes.title,
    desc: attributes.desc,
    icon: attributes.icon,
  };
}
