import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "~/lib/utils";

/*
 * A client-side password prompt for /fitness. This is a curtain, not security: the page data
 * is still in the HTML. Real auth replaces this later.
 *
 * Only the SHA-256 of the password is in the bundle. Unlocking lasts for the browser tab
 * session (sessionStorage), so a reload doesn't ask again but a new tab or window does.
 */
const PASSWORD_SHA256 = "70d213f340ede4c02525b9271a5b68e9a2a9b1c754e175300c286ef26eae18e5";
const STORAGE_KEY = "fx-unlocked";

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === PASSWORD_SHA256;
  } catch {
    return false;
  }
}

export function PasswordGate({ themeClass, children }: { themeClass: string; children: ReactNode }) {
  // "checking" until the browser has looked at sessionStorage (the server can't know).
  const [state, setState] = useState<"checking" | "locked" | "open">("checking");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setState(readUnlocked() ? "open" : "locked");
  }, []);

  useEffect(() => {
    if (state === "locked") inputRef.current?.focus();
  }, [state]);

  if (state === "open") return <>{children}</>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value) return;
    setBusy(true);
    try {
      if ((await sha256Hex(value)) === PASSWORD_SHA256) {
        try {
          sessionStorage.setItem(STORAGE_KEY, PASSWORD_SHA256);
        } catch {
          // private mode: unlocked for this page view only
        }
        setState("open");
      } else {
        setError("That’s not it. Try again.");
        setValue("");
        inputRef.current?.focus();
      }
    } catch {
      setError("This browser can’t check the password here (it needs HTTPS).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("fx fx-page", themeClass)}>
      {state === "locked" && (
        <div className="fx-gate-wrap">
          <form
            className="fx-glass fx-glass-strong fx-gate-card"
            onSubmit={onSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gate-h"
            aria-describedby="gate-d"
          >
            <span className="fx-gate-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <h1 id="gate-h" className="m-0 text-2xl font-bold tracking-[-0.02em]">
              Fitness
            </h1>
            <p id="gate-d" className="fx-text2 m-0 text-sm">
              Enter the password to see this page.
            </p>
            <label htmlFor="gate-pw" className="sr-only">
              Password
            </label>
            <input
              ref={inputRef}
              id="gate-pw"
              type="password"
              autoComplete="current-password"
              className="fx-ta fx-gate-input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "gate-err" : undefined}
              placeholder="Password"
            />
            <p id="gate-err" role="alert" className="fx-gate-err m-0 text-[13px]">
              {error}
            </p>
            <button type="submit" className="fx-btn w-full" disabled={busy || !value}>
              {busy ? "Checking…" : "Unlock"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
