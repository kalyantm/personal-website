import { useLoaderData } from "@remix-run/react";
import { getPosts } from "~/post";
import type { Post } from "~/post";
import FeaturedItem from "~/components/Blog/FeaturedItem";
import Layout from "~/components/Layout";
import BlogItem from "~/components/Blog/Item";
import Spacer from "~/components/Spacer";

export const loader = async () => {
  return Promise.all(await getPosts());
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <Layout>
      <section className="px-4 md:px-8">
        <h2 className="my-8 md:my-0">All Posts</h2>
        <div className="my-8 hidden md:block">
          <div className="mt-8 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-16">
            {posts.map((item, idx) => (
              <BlogItem post={item} key={idx} />
            ))}
          </div>
        </div>
        <div className="my-8 md:hidden">
          {posts.map((item, idx) => (
            <div key={idx}>
              <Spacer height={16} />
              <BlogItem post={item} key={idx} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
