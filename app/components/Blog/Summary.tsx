import { ArrowRightCircle } from "react-feather";
import { Link } from "remix";
import BlogItem from "./Item";

interface Props {
  posts: any;
}

export default function BlogSummary({ posts }: Props) {
  return (
    <>
      <div className="mb-8 flex justify-between text-primary">
        <h2>Recent Posts</h2>
        {/* <Link to="/posts" className="hidden items-center space-x-2 md:flex">
          <span className="text-sm font-bold ">See all posts</span>
          <ArrowRightCircle />
        </Link> */}
      </div>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-4">
        {posts.map((post, index) => (
           <BlogItem post={post} key={index} />
        ))}
      </div>
      {/* <Link
        to="/posts"
        className="my-8 flex items-center space-x-2 md:my-0 md:hidden"
      >
        <span className="text-sm font-bold">View all posts</span>
        <ArrowRightCircle />
      </Link> */}
    </>
  );
}
