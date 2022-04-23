import { Link } from "@remix-run/react";

export default function BlogItem() {
  return (
    <Link
      to="/posts"
      className="w-full transform justify-start transition duration-500"
    >
      <div className="aspect-h-4 aspect-w-3 rounded-lg bg-main-bg outline-2 outline-offset-4 outline-accent hover:outline">
        <img
          className="w-full rounded-lg object-cover object-center transition"
          src="https://picsum.photos/350/350"
          alt=""
        />
        <div className="py-4">
          <span className="mb-2 text-xl font-medium">Blog post 1</span>
          <p className="mb-4 text-base">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
        </div>
      </div>
    </Link>
  );
}
