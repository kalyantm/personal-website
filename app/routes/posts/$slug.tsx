import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";
import Layout from "~/components/Layout";
import Breadcrumbs from "~/components/Breadcrumbs";
import { ProgressIndicator } from "~/components/common/ScrollIndicator";
import Spacer from "~/components/Spacer";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData();
  console.log("post", post);
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
          {post.date} • {post.readTime} min read
        </span>
      </div>
      <div className="shadow-white rounded bg-main-bg px-4 md:px-8 flex my-8 md:my-16">
        <article className="blog-post md:max-w-[745px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.sections && (
        <aside className="hidden md:ml-16 md:-mr-16 md:flex self-start sticky top-32">
          <div>
            <h2 className="mb-4">Table of contents</h2>
            <ul>
              {post.sections.map((section: string) => (
                <li className="mb-4" key={section}>{section}</li>
              ))}
            </ul>
          </div>
        <ProgressIndicator className="-mr-16" />
        </aside>
        )}
      </div>
      <div className="lg:hidden">
        <ProgressIndicator isMobile />
      </div>
    </Layout>
  );
}
