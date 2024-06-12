import toc1 from "~/assets/toc-1.gif";
import toc2 from "~/assets/toc-2.gif";
import toc3 from "~/assets/toc-3.gif";

const TOC_GIF_MAP = {
  "toc-1": {
    src: toc1,
    alt: "Demonstration of building a V1 table of contents with little UX responsiveness",
  },
  "toc-2": {
    src: toc2,
    alt: "Demonstration of an improved table of contents where the highlighted section reflects the section being read",
  },
  "toc-3": {
    src: toc3,
    alt: "Final table of contents which highlights the current section being read in both scroll directions",
  },
};

export default function TOCGif({ toc }: { toc: "toc-1" | "toc-2" | "toc-3" }) {
  return (
    <img
      src={TOC_GIF_MAP[toc].src}
      alt={TOC_GIF_MAP[toc].alt}
      className="image-gif"
    />
  );
}
