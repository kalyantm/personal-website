import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getSnippets } from "~/snippet";
import type { Snippet } from "~/snippet";
import SnippetsSection from "./SnippetsSection";

export const loader = async () => {
  return Promise.all(await getSnippets());
};

export default function Snippets() {
  const snippets = useLoaderData<Snippet[]>();
  return (
    <Layout>
      <section className="px-8">
        <h2 className="my-8 md:my-0 md:mb-8">Snippets</h2>
        <span>
          A collection of bite sized code snippets to interesting problems that
          I come across while developing web or mobile apps. I try my best to be
          as informative about setup or execution.{" "}
        </span>
      </section>
      <section className="mt-8 px-8">
        <SnippetsSection snippets={snippets} />
      </section>
    </Layout>
  );
}
