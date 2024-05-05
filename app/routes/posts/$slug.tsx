import React from 'react';
import { useLoaderData, useLocation } from "@remix-run/react";
import {json} from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPost } from "~/post";
import Layout from "~/components/Layout";
import Breadcrumbs from "~/components/Breadcrumbs";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

const getSection = (section: string) => section.split(' ').map(el => el.toLowerCase()).join('-')

export default function PostSlug() {
  const post = useLoaderData();
  const hash = useLocation().hash;
  console.log('hash', hash)
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
      <div className="flex flex-col space-y-1 px-4 md:px-8 md:my-16">
        <span className="text-3xl mb-2">{post.title}</span>
        <span className="font-bold">
          {post.date} 
        </span>
      </div>
      <div className="shadow-white rounded bg-main-bg px-4 md:px-8 md:flex my-8 md:my-16 overflow-x-hidden md:overflow-x-visible">
        <article className="blog-post md:max-w-[745px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.sections && (
        <aside className="hidden md:ml-16 md:-mr-16 md:flex self-start sticky top-32">
          <div>
            <h2 className="mb-4">Table of contents</h2>
            <ul>
              {post.sections.map((section: string) => (
                <li className="mb-4" key={section}>
                  <a href={`#${getSection(section)}`} className={`text-left ${hash === `#${getSection(section)}` ? 'text-accent' : 'text-primary' }`}>
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
