import toc1 from "~/assets/toc-1.gif";
import toc2 from "~/assets/toc-2.gif";
import toc3 from "~/assets/toc-3.gif";

const TOC_GIF_MAP = {
  "toc-1": toc1,
  "toc-2": toc2,
  "toc-3": toc3,
};

export async function loader({ request }) {
  // path is sitename/posts/resources/toc/toc-x and we need to fetch the corresponding toc-x gif
  const url = new URL(request.url);
  const pathname = url.pathname.split("/")[4];
  url.pathname = TOC_GIF_MAP[pathname];
  const imageBuffer = await fetch(url).then((res) => res.body);
  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/gif",
    },
  });
}
