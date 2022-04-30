import { json, useLoaderData } from "remix";
import { getPosts } from "~/post";
import type { Post } from "~/post";
import FeaturedItem from "~/components/Blog/FeaturedItem";
import Layout from "~/components/Layout";
import BlogItem from "~/components/Blog/Item";
import Spacer from "~/components/Spacer";

export const loader = async () => {
  return json(await getPosts());
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();
  console.log(posts);
  const allPosts = new Array(10).fill(0);
  return (
    <Layout>
      <section className="px-8">
        <h2
          className="my-6
         md:my-0"
        >
          All Posts
        </h2>
        <div className="my-8 hidden md:block">
          <FeaturedItem />
          <div className="mt-8 grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-4">
            {allPosts.slice(1, allPosts.length).map((item, idx) => (
              <BlogItem key={idx} />
            ))}
          </div>
        </div>
        <div className="my-8 md:hidden">
          {allPosts.map((item, idx) => (
            <>
              <Spacer height={16} />
              <BlogItem key={idx} />
            </>
          ))}
        </div>
      </section>
    </Layout>
  );
}
