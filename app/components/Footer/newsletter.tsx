import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import MrCoo from "~/illustration/pigeon";
import Input from "../common/Input";
import Confetti from "react-confetti";

export default function NewsLetter() {
  const emailRef = React.useRef<HTMLInputElement | null>();
  const nameRef = React.useRef<HTMLInputElement | null>();
  const formRef = React.useRef<HTMLFormElement | undefined>();
  const newsletterBoxRef = React.useRef<HTMLDivElement | undefined>();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data.ok) {
      formRef.current.reset();
    }
  }, [fetcher]);

  return (
    <div className="grid grid-cols-1 text-primary md:grid-cols-2">
      <div className="flex flex-col">
        <h2>Stay in the loop</h2>
        <span className="my-4 text-base">
          Subscribe to the newsletter and stay updated with my latest posts. Get
          a peek into some of the tech I'm working on, where I'm travelling or
          just something completely random!
        </span>
        <fetcher.Form
          method="post"
          action="/newsletter/subscribe"
          ref={formRef}
          className="relative min-h-[200px]"
        >
          {fetcher.type === "done" && fetcher.data.subscription ? (
            <div className="flex-column flex h-full items-center justify-center">
              <Confetti
                width={formRef.current?.getBoundingClientRect().width}
                height={formRef.current?.getBoundingClientRect().height}
                confettiSource={{
                  x: formRef.current?.getBoundingClientRect().width / 2,
                  y: formRef.current?.getBoundingClientRect().height / 2,
                }}
                initialVelocityX={10}
                initialVelocityY={20}
                recycle={false}
              />
              <div className="flex h-full w-full flex-col justify-center space-y-2">
                <span className="text-2xl font-bold">Welcome aboard</span>
                <span>
                  Thanks for subscribing! Check your inbox for a welcome mail.
                </span>
              </div>
            </div>
          ) : (
            <fieldset
              disabled={fetcher.state === "submitting"}
              className="grid w-full grid-cols-1 gap-4 md:w-full"
            >
              <Input
                ref={nameRef}
                className="w-full"
                placeholder="Name"
                name="name"
              />
              <Input
                ref={emailRef}
                className="w-full"
                placeholder="Email"
                name="email"
                type="email"
                required
              />
              <button
                type="submit"
                className="relative flex w-fit items-center space-x-2 rounded-lg bg-secondary px-6 py-4 text-left text-main-bg"
                disabled={fetcher.state === "submitting"}
              >
                <span>Subscribe</span>
                {fetcher.state === "submitting" && (
                  <div
                    className="h-6 w-6 animate-spin rounded-full"
                    style={{
                      border: "4px rgba(255,255,255,0.25) solid",
                      borderTop: "4px rgba(255,255,255,1) solid",
                    }}
                  />
                )}
              </button>
              {/* {fetcher?.type === "done" ? (
              fetcher.data.subscription ? (
                <p>Thanks for subscribing!</p>
              ) : (
                <p style={{ color: "red" }}>Something went wrong!</p>
              )
            ) : null} */}
            </fieldset>
          )}
        </fetcher.Form>
      </div>
      <div className="mt-16 flex items-end justify-center md:mt-0 md:justify-center">
        <MrCoo />
      </div>
    </div>
  );
}
