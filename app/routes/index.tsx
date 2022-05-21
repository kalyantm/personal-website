import React from "react";
import { useLoaderData } from "remix";
import AboutSummary from "~/components/About/Summary";
import BlogSummary from "~/components/Blog/Summary";
import Layout from "~/components/Layout";
import { getPosts } from "~/post";

export const loader = async () => {
  return Promise.all(await getPosts());
};

export default function Index() {
  const posts = useLoaderData();
  const orderedPosts = React.useMemo(() => {
    return [
      posts.find((post) => post.featured),
      ...posts.filter((post) => !post.featured),
    ];
  }, [posts]);
  console.log("orderd", orderedPosts);
  return (
    <Layout hideIllustration={false}>
      <div className="hidden md:block">
        <section className="px-8">
          <AboutSummary />
        </section>
        <hr className="my-16 mx-8 border border-primary opacity-10" />
      </div>
      <section className="px-8">
        <BlogSummary posts={orderedPosts} />
      </section>
    </Layout>
  );
}
