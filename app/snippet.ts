import path from "path";
import fs from "fs/promises";
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

// IMP: Relative to server output, not source!
const snippetsPath = path.join(__dirname, "..", "snippets");

function isValidSnippetAttributes(
  attributes: any
): attributes is SnippetMarkdownAttributes {
  return attributes?.title;
}

export async function getSnippets() {
  const dir = await fs.readdir(snippetsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(snippetsPath, filename));
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
  const filepath = path.join(snippetsPath, slug + ".md");
  const file = await fs.readFile(filepath);
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
