import { Activity, Book, Navigation } from "react-feather";
import Spacer from "~/components/Spacer";

const CONTENT_MAP = {
  music: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="var(--color-text)"
        className="rounded-full"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 2c5.55 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.395 0-8 3.605-8 8s3.605 8 8 8 8-3.605 8-8c0-4.414-3.573-8-8-8zm3.75 12.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1s-.7.5-1.05.25zM6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75z" />
      </svg>
    ),
    header: "CURRENTLY JAMMING TO",
  },
  location: {
    icon: <Navigation size={24} fill="none" />,
    header: "CURRENTLY IN",
  },
  read: {
    icon: <Book size={24} fill="none" />,
    header: "CURRENTLY READING",
  },
  fitness: {
    icon: <Activity size={24} fill="none" />,
    header: "CURRENT FITNESS",
  },
};

interface Props {
  type: "music" | "location" | "read" | "fitness";
  children?: React.ReactNode;
  coverImg?: string | React.ReactNode;
}

export default function NowCard({ type, children, coverImg }: Props) {
  return (
    <div
      className={`bg-white aspect-h-4 aspect-w-3 my-4 flex flex-col rounded-lg bg-main-bg shadow-lg outline-2 outline-offset-4 outline-accent hover:outline dark:bg-grey-500 md:flex-row`}
    >
      {typeof coverImg === "string" ? (
        <img
          className="rounded-lg rounded-bl-none rounded-br-none md:h-[200px] md:max-h-[200px] md:w-[200px] md:max-w-[200px] md:rounded-bl-lg md:rounded-tr-none md:rounded-br-none"
          src={coverImg ? coverImg : `https://picsum.photos/200/200`}
          alt=""
        />
      ) : (
        coverImg
      )}
      <div className="py-4 px-4">
        <div className="flex items-center space-x-1 text-xs font-normal">
          {CONTENT_MAP[type].icon}
          <span>{CONTENT_MAP[type].header}</span>
        </div>
        <Spacer height={16} />
        {children}
      </div>
    </div>
  );
}
