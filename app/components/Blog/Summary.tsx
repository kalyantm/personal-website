import { ArrowRightCircle } from "react-feather";
import BlogItem from "./Item";

export default function BlogSummary() {
  return (
    <>
      <div className="mb-8 flex justify-between text-primary">
        <h2 className="font-medium">Recent Posts</h2>
        <span className="hidden items-center space-x-2 md:flex">
          <span className="text-base">See all posts</span>
          <ArrowRightCircle />
        </span>
      </div>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-4">
        <BlogItem />
        <BlogItem />
        <BlogItem />
      </div>
    </>
  );
}
