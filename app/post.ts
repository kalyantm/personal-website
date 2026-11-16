import { POST_FILES } from "./content.generated";
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

// Posts are baked into the server build by scripts/build-content.mjs (see that file for why).
function readPost(filename: string): string {
  const file = POST_FILES[filename];
  if (file === undefined) throw new Error(`ENOENT: no such post: ${filename}`);
  return file;
}

export async function getPosts() {
  const postsPath = Object.keys(POST_FILES).map((name) => ({ name }));
  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = readPost(dirent.name);
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
  console.log("posts", posts);
  return posts.sort((p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime());
}

export async function getPost(slug: string) {
  const file = readPost(`${slug}.mdx`);
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
    body,
    title: attributes.title,
    readTime: attributes.readTime,
    date: attributes.date,
    coverImg: attributes.coverImg,
    featured: !!attributes.featured,
    desc: attributes.desc,
    sections: attributes.sections,
  };
}
