import { ArrowRightCircle } from "react-feather";
import { Link } from "remix";
import pp from "../../assets/pp-final.jpeg";

export default function AboutSummary() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="aspect-h-4 aspect-w-3 rounded-lg bg-main-bg">
        <img
          className="mx-auto rounded-lg md:mx-0"
          src={pp}
          alt=""
          width={150}
          height={150}
        />
      </div>
      <div className="ml-16 flex flex-col space-y-8 border-l-2 border-l-accent pl-8">
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
