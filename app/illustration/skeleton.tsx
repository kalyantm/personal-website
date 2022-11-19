import React from "react";
import Defs from "./defs";

export default function Skeleton({ children }: { children: React.ReactNode }) {
  return (
    <svg className="md:rounded-3xl" viewBox="0 0 1512 692" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1512" height="692" fill="url(#bg-color)" />
      {children}
      <Defs />
    </svg>
  );
}
