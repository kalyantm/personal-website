import ContactSummary from "../Contact/Summary";
import NewsLetter from "../NewsLetter";
import { Heart } from "react-feather";
import Spacer from "../Spacer";
import TailwindIcon from "../../illustration/tailwind";
import NetlifyIcon from "../../illustration/netlify";
import RemixIcon from "../../illustration/remix";

export default function Footer() {
  return (
    <div className="my-0 mx-auto max-w-screen-lg px-8 py-8 text-primary">
      <ContactSummary />
      <div className="my-16">
        <NewsLetter />
      </div>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="hidden flex-col md:block">
          <span>All rights reserved © 2022 • Illustrations by KTM</span>
        </div>
        <div className="flex flex-col md:hidden">
          <span>All rights reserved © 2022 </span>
          <Spacer height={8} />
          <span>Illustrations by KTM</span>
        </div>
        <div className="col flex-col">
          <span className="flex items-center">
            Powered by
            <Spacer width={16} />
            <div className="align-center flex items-center space-x-4">
              <Heart size={24} color="red" fill="red" />
              <RemixIcon />
              <TailwindIcon />
              <NetlifyIcon />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
