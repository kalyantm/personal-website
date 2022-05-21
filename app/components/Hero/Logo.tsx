import React from "react";
import { Link } from "remix";

export default function Logo() {
  return (
    <Link to="/" className="inline-block max-w-[64px]">
      <h2 className="text-xl lowercase">ktm</h2>
    </Link>
  );
}
