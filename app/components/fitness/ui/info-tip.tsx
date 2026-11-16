import * as Popover from "@radix-ui/react-popover";
import { createContext, useContext, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "~/lib/utils";

/** The dashboard's theme class, so portalled popovers (outside .fx) get the same tokens. */
export const FxThemeContext = createContext("fx-dark");

/**
 * A small (i) next to a section title. Opens on hover with a mouse and on tap/click
 * everywhere else, and is keyboard reachable.
 */
export function InfoTip({ title, children }: { title: string; children: ReactNode }) {
  const theme = useContext(FxThemeContext);
  const [open, setOpen] = useState(false);
  // Clicked open (vs. hovered open): stays open when the pointer leaves.
  const pinned = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const setClosed = () => {
    pinned.current = false;
    setOpen(false);
  };
  const hover = (enter: boolean) => (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || pinned.current) return;
    clearTimeout(closeTimer.current);
    if (enter) setOpen(true);
    else closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const onTriggerClick = (e: MouseEvent) => {
    // Take over Radix's toggle: hover may already have opened it, and a click should pin, not close.
    e.preventDefault();
    clearTimeout(closeTimer.current);
    if (open && pinned.current) setClosed();
    else {
      pinned.current = true;
      setOpen(true);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : setClosed())}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="fx-info"
          aria-label={`About ${title}`}
          onClick={onTriggerClick}
          onPointerEnter={hover(true)}
          onPointerLeave={hover(false)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 11v6" />
            <circle cx="12" cy="7.6" r="0.6" fill="currentColor" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className={cn("fx", theme, "fx-info-pop")}
          onPointerEnter={hover(true)}
          onPointerLeave={hover(false)}
          // Hover-opened popovers shouldn't steal focus from the page
          onOpenAutoFocus={(e) => {
            if (!pinned.current) e.preventDefault();
          }}
        >
          <p className="fx-info-title">{title}</p>
          <div className="fx-info-body">{children}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
