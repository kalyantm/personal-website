import { useLoaderData } from "remix";
import BlogSummary from "~/components/Blog/Summary";
import Layout from "~/components/Layout";
import Spacer from "~/components/Spacer";
import { getPosts } from "~/post";

export const loader = async () => {
  return Promise.all(await getPosts());
};

export default function Index() {
  const posts = useLoaderData();
  return (
    <Layout hideIllustration={false}>
      {/* <div className="">
          <AboutSummary />
        <hr className="my-16 mx-8 border border-primary opacity-10" />
      </div> */}
      <Spacer height={32} />
      <section className="px-4 md:px-8">
        <BlogSummary posts={posts} />
      </section>
    </Layout>
  );
}
