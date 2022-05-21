import { Link } from "@remix-run/react";
import { TrendingUp } from "react-feather";
import Spacer from "../Spacer";

interface Props {
  post: any;
}

const POST_LINK_PREFIX = `/posts`;
export default function BlogItem({ post }: Props) {
  console.log("post", post);
  return (
    <Link
      to={`${POST_LINK_PREFIX}/${post.slug}`}
      className="relative w-full transform justify-start transition duration-500"
    >
      {post.featured && (
        <span className="absolute top-2 -left-2 flex items-center space-x-2 rounded-lg bg-book-red p-1 text-xs font-bold text-primary">
          <TrendingUp size={16} />
          <span>Featured</span>
        </span>
      )}
      <div className="aspect-h-4 aspect-w-3 h-full rounded-lg bg-main-bg outline-2 outline-offset-4 outline-accent hover:outline">
        <img
          className="w-full rounded-lg object-cover object-center transition"
          src={post.coverImg}
          alt=""
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
