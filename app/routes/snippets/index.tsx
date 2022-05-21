import { useLoaderData } from "remix";
import Layout from "~/components/Layout";
import Spacer from "~/components/Spacer";
import { getSnippets } from "~/snippet";
import type { Snippet } from "~/snippet";
import SnippetsSection from "./SnippetsSection";

export const loader = async () => {
  return Promise.all(await getSnippets());
};

export default function Snippets() {
  const snippets = useLoaderData<Snippet[]>();
  console.log("snippets", snippets);
  return (
    <Layout>
      <section className="px-8">
        <h2 className="mb-4">Snippets</h2>
        <span>
          A collection of code titbits about common problems that we all run
          into while developing web or mobile apps. I try my best to be as
          informative about setup or execution.{" "}
        </span>
      </section>
      <section className="mt-8 px-8">
        <SnippetsSection snippets={snippets} />
      </section>
    </Layout>
  );
}
