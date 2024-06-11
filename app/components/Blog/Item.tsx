import { Link } from "@remix-run/react";
import Spacer from "../Spacer";
import helloWorld from "~/assets/hello-world.jpeg";
import testing from "~/assets/testing.svg";
import expandable from '~/assets/expandable.svg';
import toc from '~/assets/table-of-contents.svg';

const IMAGE_MAP = {
  helloWorld,
  testing,
  expandable,
  toc
};

interface Props {
  post: any;
}

const POST_LINK_PREFIX = `/posts`;
export default function BlogItem({ post }: Props) {
  return (
    <Link
      to={`${POST_LINK_PREFIX}/${post.slug}`}
      className="relative h-full w-full transform justify-start transition duration-500"
    >
      <div className="aspect-h-4 aspect-w-3 h-full rounded-lg bg-main-bg outline-2 outline-offset-4 outline-accent hover:outline">
        <img
          className="h-auto w-full rounded-lg object-cover object-center transition"
          src={IMAGE_MAP[post.coverImg]}
          alt={`Go to Post: ${post.title}`}
          loading="lazy"
        />
        <Spacer height={16} />
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-bold">
            {post.date} 
          </span>
          <span className="text-xl font-medium">{post.title}</span>
        </div>
      </div>
    </Link>
  );
}
