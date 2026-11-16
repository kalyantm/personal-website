import { forwardRef, type ButtonHTMLAttributes } from "react";

/** Unstyled button. The fitness dashboard styles it through `.fx .fx-btn`. */
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} {...props} />;
});
