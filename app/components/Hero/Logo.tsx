import React from "react";
import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <Link to="/" className="max-w-[64px] inline-block">
      <h2 className="text-xl lowercase">ktm</h2>
    </Link>
  );
}
