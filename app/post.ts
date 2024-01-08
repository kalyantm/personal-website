import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";
import rehypeHighlight from "rehype-highlight";
import { rehype } from "rehype";

export type Post = {
  slug: string;
  title: string;
  readTime: number;
  date: string;
  coverImg: string;
  desc: string;
  sections: string[];
  featured?: boolean;
};

export type PostMarkdownAttributes = {
  title: string;
  readTime: number;
  date: string;
  coverImg: string;
  featured?: boolean;
  desc: string;
  sections: string[];
};

// IMP: Relative to server output, not source!
// const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts() {
  const dir = await fs.readdir(`${__dirname}/../../app/posts`, {
    withFileTypes: true,
  });
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(
        path.join(`${__dirname}/../../app/posts`, filename.name)
      );
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.name.replace(/\.mdx$/, ""),
        title: attributes.title,
        desc: attributes.desc,
        readTime: attributes.readTime,
        coverImg: attributes.coverImg,
        featured: !!attributes.featured,
        date: attributes.date,
        sections: attributes.sections,
      };
    })
  );
}

export async function getPost(slug: string) {
  const filepath = path.join(`${__dirname}/../../app/posts`, slug + ".mdx");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  const html = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeHighlight)
    .process(marked(body));

  return {
    slug,
    html: html.value,
    title: attributes.title,
    readTime: attributes.readTime,
    date: attributes.date,
    coverImg: attributes.coverImg,
    featured: !!attributes.featured,
    desc: attributes.desc,
    sections: attributes.sections,
  };
}
