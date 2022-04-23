import React from "react";

interface Props {
  className?: string;
}

export default function Input({
  className,
  placeholder,
  ...rest
}: Props & React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`rounded-lg bg-grey-500 py-4 pl-4 outline-2 outline-offset-4 outline-accent ${className}`}
      placeholder={placeholder}
    />
  );
}
