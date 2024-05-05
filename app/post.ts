import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
// import invariant from "tiny-invariant";
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

// function isValidPostAttributes(
//   attributes: any
// ): attributes is PostMarkdownAttributes {
//   return attributes?.title;
// }

// const postsPath = path.join(__dirname, "../..", "posts");

export async function getPosts() {
  const postsPath = await fs.readdir(`${__dirname}/../../app/posts`, {
    withFileTypes: true,
  });
  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fs.readFile(
        path.join(`${__dirname}/../../app/posts`, dirent.name)
      );
      const { attributes }: { attributes: any } = parseFrontMatter(
        file.toString()
      );
      return {
        slug: dirent.name.replace(/\.mdx/, ""),
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
  return posts
}

export async function getPost(slug: string) {
  const postPath = `${__dirname}/../../app/posts/${slug}.mdx`;
  const file = await fs.readFile(postPath, "utf8");
  const { attributes, body }: { attributes: any; body: any } = parseFrontMatter(
    file.toString()
  );
  // invariant(
  //   isValidPostAttributes(attributes),
  //   `Post ${filepath} is missing attributes`
  // );

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
