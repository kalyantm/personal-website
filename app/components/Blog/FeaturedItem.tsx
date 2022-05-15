import { Link } from "@remix-run/react";

export default function FeaturedItem() {
  return (
    <Link to="/posts/90s-mixtape">
      <div className="bg-white hover:bg-gray-100 flex rounded text-primary shadow-lg outline-2 outline-offset-4 outline-accent hover:outline dark:bg-grey-500">
        <div className="w-1/3">
          <img
            className="h-full rounded-l object-cover"
            src="https://picsum.photos/350/350"
            alt=""
            width={350}
            height={350}
          />
        </div>
        <div className="align-start flex w-2/3 flex-col justify-between p-4">
          <div>
            <span>New</span>
            <h5 className="text-gray-900 dark:text-white mb-2 text-2xl font-bold tracking-tight">
              Noteworthy technology acquisitions 2021
            </h5>
            <p className="text-gray-700 dark:text-gray-400 mb-3 font-normal">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
            <p>5 min read</p>
          </div>
          <div>
            <p>Read more</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
