import Layout from "~/components/Layout";
import Spacer from "~/components/Spacer";
import SnippetsSection from "./SnippetsSection";

export default function Snippets() {
  return (
    <Layout>
      <section className="px-8">
        <h2 className="mt-8 mb-4">Snippets</h2>
        <span>
          A collection of code titbits about common problems that we all run
          into while developing web or mobile apps. I try my best to be as
          informative about setup or execution.{" "}
        </span>
      </section>
      <Spacer height={64} />
      <section className="px-8">
        <SnippetsSection />
      </section>
    </Layout>
  );
}
