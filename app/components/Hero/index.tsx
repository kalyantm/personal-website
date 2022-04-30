import Illustration from "~/illustration";
import Hamburger from "./Hamburger";
import Header from "./Header";

export default function Hero({
  hideIllustration,
}: {
  hideIllustration: boolean;
}) {
  return (
    <div className="relative flex flex-col-reverse">
      {!hideIllustration && <Illustration />}
      <div className={!hideIllustration ? `absolute top-0 w-full` : ""}>
        <Header />
      </div>
      <Hamburger />
    </div>
  );
}
