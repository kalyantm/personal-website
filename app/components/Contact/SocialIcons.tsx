import { GitHub, Instagram, Linkedin, Mail, Twitter } from "react-feather";
import LinkIcon from "../common/Icon";

export default function SocialIcons({
  className,
  size,
}: {
  className?: string;
  size: number;
}) {
  return (
    <div className={`flex space-x-6 ${className}`}>
      <LinkIcon to="/">
        <Mail size={size} />
      </LinkIcon>
      <LinkIcon to="/">
        <Twitter size={size} />
      </LinkIcon>
      <LinkIcon to="/">
        <Instagram size={size} />
      </LinkIcon>
      <LinkIcon to="/">
        <GitHub size={size} />
      </LinkIcon>
      <LinkIcon to="/">
        <Linkedin size={size} />
      </LinkIcon>
    </div>
  );
}
// className="flex w-2/3 space-x-6">
