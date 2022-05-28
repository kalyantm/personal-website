import React from "react";

interface Props {
  children: React.ReactNode;
  to: string;
}

export default function LinkIcon({ to, children }: Props) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={to}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {React.cloneElement(children, {
        color: hover ? "var(--color-accent)" : "var(--color-text)",
      })}
    </a>
  );
}
