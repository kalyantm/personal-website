import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import Layout from "~/components/Layout";
import { getSnippet } from "~/snippet";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getSnippet(params.slug));
};

export default function PostSlug() {
  const snippet = useLoaderData();
  console.log("snippet", snippet);
  return (
    <Layout>
      <div className="space-y-1/2 flex flex-col items-center justify-center">
        <span className="mt-6 text-3xl md:my-0">{snippet.title}</span>
        {/* <span>
          {post.date} • {post.readTime} min read
        </span> */}
      </div>
      <div
        className="my-8 rounded py-4 px-4 md:px-8"
        style={{ maxHeight: 642 }}
      >
        <img src={snippet.icon} className="h-full w-full rounded" />
      </div>
      <div className="shadow-white relative rounded bg-main-bg px-4 py-8 md:px-8">
        <div dangerouslySetInnerHTML={{ __html: snippet.html }} />
      </div>
    </Layout>
  );
}