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
      <LinkIcon to="mailto:madabhushi.kalyan@gmail.com">
        <Mail size={size} />
      </LinkIcon>
      <LinkIcon to="https://twitter.com/thisisktm">
        <Twitter size={size} />
      </LinkIcon>
      <LinkIcon to="https://www.instagram.com/this_is_ktm/">
        <Instagram size={size} />
      </LinkIcon>
      <LinkIcon to="https://github.com/kalyantm">
        <GitHub size={size} />
      </LinkIcon>
      <LinkIcon to="https://www.linkedin.com/in/kalyantm/">
        <Linkedin size={size} />
      </LinkIcon>
    </div>
  );
}
