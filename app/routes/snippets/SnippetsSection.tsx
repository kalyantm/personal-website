import { Link } from "remix";

// const prefix = "/snippets";
// const SNIPPETS = [
//   {
//     title: "Animated hamburger",
//     desc: "Spice up the your hamburger icon by using framer motion to add a smooth transition between the open and closed states",
//     icon: "",
//     to: `${prefix}/framer-motion-hamburger`,
//   },
//   {
//     title: "Animated Theme toggler",
//     desc: "Switch between your dark and light theme by adding some flair to your theme toggler using framer motion",
//     icon: "",
//     to: `${prefix}/framer-motion-theme-toggler`,
//   },
//   {
//     title: "Google Fit stats",
//     desc: "Showcase your stats from the Google Fitness API v1",
//     icon: "",
//     to: `${prefix}/google-fitness-api`,
//   },
// ];

export default function SnippetsSection({ snippets }) {
  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-4">
      {snippets.map((snippet, index) => (
        <Link
          to={snippet.slug}
          className={`bg-white aspect-h-4 aspect-w-3 flex flex-col space-y-4 rounded-lg bg-main-bg p-4 shadow-lg outline-2 outline-offset-4 outline-accent hover:outline dark:bg-grey-500`}
          key={index}
        >
          <div className="flex items-center space-x-4">
            <img
              className=" rounded-full shadow-card"
              src="https://picsum.photos/50/50"
              alt=""
            />
            <span>{snippet.title}</span>
          </div>
          <span>{snippet.desc}</span>
        </Link>
      ))}
    </div>
  );
}
