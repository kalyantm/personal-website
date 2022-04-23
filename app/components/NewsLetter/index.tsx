import React from "react";
import MrCoo from "~/illustration/pigeon";
import Input from "../common/Input";

export default function NewsLetter() {
  const emailRef = React.useRef<HTMLInputElement | null>();
  const nameRef = React.useRef<HTMLInputElement | null>();
  return (
    <div className="grid grid-cols-1 text-primary md:grid-cols-2">
      <div className="flex flex-col">
        <h2>Stay in the loop</h2>
        <span className="my-4 text-base">
          Subscribe to the newsletter and stay updated with my latest posts. Get
          a peek into some of the tech I'm working on, where I'm travelling or
          just something completely random!
        </span>
        <div className="grid w-full grid-cols-1 gap-4 md:w-full">
          <Input ref={nameRef} className="w-full" placeholder="Name" />
          <Input ref={emailRef} className="w-full" placeholder="Email" />
          <button
            type="submit"
            className="rounded-lg bg-secondary px-4 py-4"
            style={{ width: 150 }}
          >
            Subscribe
          </button>
        </div>
      </div>
      <div className="mt-16 flex items-end justify-center md:mt-0 md:justify-start md:justify-center">
        <MrCoo />
      </div>
    </div>
  );
}
