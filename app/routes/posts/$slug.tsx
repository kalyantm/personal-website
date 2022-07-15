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
      <div className="flex flex-col items-center justify-center space-y-1 px-4 md:px-0">
        <span className="text-center text-3xl md:my-0">{post.title}</span>
        <span className="font-bold">
          {post.date} • {post.readTime} min read
        </span>
      </div>
      <div
        className="my-4 rounded px-4 md:my-8 md:px-8"
        style={{ height: 642 }}
      >
        <img src={post.coverImg} className="h-full w-full rounded" />
      </div>
      <div className="shadow-white relative rounded bg-main-bg px-4 md:px-8 flex">
        <article className="blog-post flex-[1_1_700px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        <aside className="hidden lg:flex flex-[0_1000000_250px] justify-center sticky top-4 ml-16 max-h-screen">
          <ul className="ml-4">
            <h2 className="mb-4">Table of contents</h2>
            {post.sections.map(section => (
              <li className="mb-4" key={section}>{section}</li>
            ))}
          </ul>
          <ProgressIndicator className="-mr-8" />
        </aside>
        <div className="lg:hidden">
          <ProgressIndicator isMobile />
        </div>
      </div>
    </Layout>
  );
}
