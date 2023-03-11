import { Link } from "@remix-run/react";
import { TrendingUp } from "react-feather";
import Spacer from "../Spacer";

interface Props {
  post: any;
}

const POST_LINK_PREFIX = `/posts`;
export default function BlogItem({ post }: Props) {
  return (
    <Link
      to={`${POST_LINK_PREFIX}/${post.slug}`}
      className="relative w-full h-full transform justify-start transition duration-500"
    >
      <div className="aspect-h-4 aspect-w-3 h-full rounded-lg bg-main-bg outline-2 outline-offset-4 outline-accent hover:outline">
        <img
          className="w-full h-auto rounded-lg object-cover object-center transition"
          src={post.coverImg}
          alt=""
          loading="lazy"
        />
        <Spacer height={16} />
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-bold">
            {post.date} • {post.readTime} min read
          </span>
          <span className="text-xl font-medium">{post.title}</span>
        </div>
      </div>
    </Link>
  );
}
