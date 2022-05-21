import { ArrowRightCircle } from "react-feather";
import { Link } from "remix";

export default function AboutSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
      <div className="aspect-h-4 aspect-w-3 rounded-lg bg-main-bg">
        <img
          className="mx-auto rounded-full md:mx-0"
          src="https://picsum.photos/350/350"
          alt=""
        />
      </div>
      <div className="col-span-2 flex flex-col space-y-8">
        <h1 className="text-3xl">
          👋 Hi, I'm Kalyan. I try to solve interesting problems using software.
        </h1>
        <span className="text-xl">
          I'm a product focused frontend and mobile engineer who strives to
          write software that is simple, reliable and understandable.
        </span>
        <span className="text-xl">
          I'm currently building the mobile app of{" "}
          <a href="https://proton.ai/">proton.ai</a>
        </span>
        <Link to="/about" className="flex items-center space-x-2">
          <span className="text-sm font-bold">Learn more about me</span>
          <ArrowRightCircle size={24} />
        </Link>
      </div>
    </div>
  );
}
