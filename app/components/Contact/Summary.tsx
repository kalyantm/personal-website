import SocialIcons from "./SocialIcons";

export default function ContactSummary() {
  return (
    <div className="flex flex-col space-y-6 text-primary">
      <h2 className="flex-auto">Want to say hello?</h2>
      <span className="my-4 text-base">
        I'm always up for a conversation! Feel free to reach me, even if it's
        just a quick hello.
      </span>
      <div className="flex w-2/3 flex-auto flex-col">
        <SocialIcons size={32} />
      </div>
    </div>
  );
}
