import React from "react";
import { useLoaderData, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPost } from "~/post";
import Layout from "~/components/Layout";
import Breadcrumbs from "~/components/Breadcrumbs";
import Markdown from "markdown-to-jsx";
import ExpandableListSandpack from "~/components/posts/ExpandableList";
import SyntaxHighlightedCode from "~/components/posts/SyntaxHighlightedCode";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

const getSection = (section: string) =>
  section
    .split(" ")
    .map((el) => el.toLowerCase())
    .join("-");

export default function PostSlug() {
  const post = useLoaderData();
  const hash = useLocation().hash;
  console.log("hash", hash);
  return (
    <Layout>
      <div className="my-8 px-4 md:hidden">
        <Breadcrumbs
          links={[
            { name: "Home", slug: "/" },
            { name: "All posts", slug: "/posts" },
          ]}
        />
      </div>
      <div className="flex flex-col space-y-1 px-4 md:my-16 md:px-8">
        <span className="mb-2 text-3xl">{post.title}</span>
        <span className="font-bold">{post.date}</span>
      </div>
      <div className="shadow-white my-8 overflow-x-hidden rounded bg-main-bg px-4 md:my-16 md:flex md:overflow-x-visible md:px-8">
        <article className="blog-post md:max-w-[745px]">
          <Markdown
            options={{
              overrides: {
                code: SyntaxHighlightedCode,
                ExpandableListSandpack: {
                  component: () => <ExpandableListSandpack />,
                },
              },
            }}
          >
            {post.body}
          </Markdown>
        </article>
        {post.sections && (
          <aside className="sticky top-32 hidden self-start md:-mr-16 md:ml-16 md:flex">
            <div>
              <h2 className="mb-4">Table of contents</h2>
              <ul>
                {post.sections.map((section: string) => (
                  <li className="mb-4" key={section}>
                    <a
                      href={`#${getSection(section)}`}
                      className={`text-left ${
                        hash === `#${getSection(section)}`
                          ? "text-accent"
                          : "text-primary"
                      }`}
                    >
                      {section}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </Layout>
  );
}
