import AboutSummary from "~/components/About/Summary";
import BlogSummary from "~/components/Blog/Summary";
import Layout from "~/components/Layout";

export default function Index() {
  return (
    <Layout hideIllustration={false}>
      <div className="hidden md:block">
        <section className="px-8">
          <AboutSummary />
        </section>
        <hr className="my-16 mx-8 border border-primary opacity-10" />
      </div>
      <section className="px-8">
        <BlogSummary />
      </section>
    </Layout>
  );
}
