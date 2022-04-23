import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData();
  console.log("post", post);
  return (
    <Layout>
      <div className="space-y-1/2 flex flex-col items-center justify-center">
        <span className="mt-8 text-3xl md:my-0">{post.title}</span>
        <span>
          {post.date} • {post.readTime} min read
        </span>
      </div>
      <div className="my-8 lgV2:-mx-16" style={{ height: 642 }}>
        <img src={post.coverImg} className="h-full w-full rounded" />
      </div>
      <div className="shadow-white relative rounded bg-main-bg p-6 lgV2:-mx-6 lgV2:-mt-32 ">
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
}
