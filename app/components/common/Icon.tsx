import React from "react";
import { Link } from "remix";

interface Props {
  children: React.ReactNode;
  to: string;
}

export default function LinkIcon({ to, children }: Props) {
  const [hover, setHover] = React.useState(false);
  return (
    <Link
      to={to}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {React.cloneElement(children, {
        // color: hover ? "var(--color-accent)" : "var(--color-bg)",
        color: hover ? "var(--color-accent)" : "var(--color-text)",
      })}
    </Link>
  );
}
