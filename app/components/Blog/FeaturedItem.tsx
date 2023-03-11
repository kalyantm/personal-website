import { Link } from "@remix-run/react";
import { ArrowRightCircle} from "react-feather";

interface Props {
  post: any;
}

export default function FeaturedItem({ post }: Props) {
  return (
    <Link to={post.slug}>
      <div className="bg-white hover:bg-gray-100 relative flex rounded text-primary shadow-lg outline-2 outline-offset-4 outline-accent hover:outline dark:bg-grey-500">
        {/* {post.featured && (
          <span className="absolute top-2 -left-2 flex items-center space-x-2 rounded-lg bg-book-red p-1 text-xs font-bold uppercase text-primary">
            <TrendingUp size={16} />
            <span>Featured</span>
          </span>
        )} */}
        <div className="w-1/3">
          <img
            className="h-full rounded-l object-cover"
            src={post.coverImg}
            alt=""
            width={350}
            height={350}
          />
        </div>
        <div className="align-start flex w-2/3 flex-col justify-between p-4">
          <div>
            <h5 className="text-gray-900 dark:text-white mb-2 text-2xl font-bold tracking-tight">
              {post.title}
            </h5>
            <p className="text-gray-700 dark:text-gray-400 mb-3 font-normal">
              {post.desc}
            </p>
            <span className="text-sm font-bold">
              {post.date} • {post.readTime} min read
            </span>
          </div>
          <button className="flex items-center space-x-2">
            <span className="text-sm font-bold">Read full article</span>
            <ArrowRightCircle />
          </button>
        </div>
      </div>
    </Link>
  );
}
