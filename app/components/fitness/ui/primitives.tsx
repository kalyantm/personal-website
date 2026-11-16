import { useCallback, useState, type ChangeEvent, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from "~/lib/utils";

// React 17 has no useId. The id only scopes framer-motion's layoutId, which never
// reaches the DOM, so a per-instance counter is enough (no hydration concerns).
let segCounter = 0;
function useStableId() {
  const [id] = useState(() => `s${++segCounter}`);
  return id;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** A glass card that rises in on mount. */
export function GlassCard({
  children,
  className,
  labelledBy,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      aria-labelledby={labelledBy}
      className={cn("fx-glass", className)}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.section>
  );
}

/** Same entrance as GlassCard, without the glass. */
export function Rise({
  children,
  className,
  labelledBy,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      aria-labelledby={labelledBy}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.section>
  );
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

/**
 * iOS-style segmented control: shadcn ToggleGroup for keyboard and
 * screen-reader behaviour, with a spring-animated thumb that slides
 * between options.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  label: string;
  className?: string;
}) {
  const id = useStableId();
  const reduce = useReducedMotion();
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v: string) => {
        if (v) onChange(v as T);
      }}
      aria-label={label}
      className={cn("fx-seg", className)}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} className="fx-seg-item">
          {o.value === value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="fx-seg-thumb"
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
            />
          )}
          <span className="relative z-[1]">{o.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/**
 * Pointer scrubbing for SVG charts. Attach `surface` to the element that
 * wraps the <svg> (same width as the chart). `mode: "bins"` is for bar
 * charts, `"points"` for lines.
 */
export function useScrub(count: number, padFraction: number, mode: "points" | "bins" = "points") {
  const [index, setIndex] = useState<number | null>(null);
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      if (!r.width) return;
      const t = ((e.clientX - r.left) / r.width - padFraction) / (1 - 2 * padFraction);
      const raw = mode === "bins" ? Math.floor(t * count) : Math.round(t * (count - 1));
      setIndex(Math.max(0, Math.min(count - 1, raw)));
    },
    [count, padFraction, mode],
  );
  const clear = useCallback(() => setIndex(null), []);
  const onRangeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setIndex(Number(e.target.value)), []);
  return { index, clear, onRangeChange, surface: { onPointerMove, onPointerLeave: clear } };
}

/** Visually hidden range input: keyboard and screen-reader access to a scrubbable chart. */
export function ScrubInput({
  count,
  value,
  onChange,
  onBlur,
  label,
  valueText,
}: {
  count: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  label: string;
  valueText: string;
}) {
  return (
    <input
      type="range"
      className="sr-only"
      min={0}
      max={count - 1}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      aria-label={label}
      aria-valuetext={valueText}
    />
  );
}

/** Floating chart tooltip. The ScrubInput carries the same text for assistive tech. */
export function ChartTip({ left, children }: { left: string; children: ReactNode }) {
  return (
    <div className="fx-tip" style={{ left }} aria-hidden="true">
      {children}
    </div>
  );
}

export function StatTile({ label, value, size = "md" }: { label: string; value: string; size?: "sm" | "md" | "lg" }) {
  const valueSize = size === "lg" ? "text-[22px]" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <div className="fx-inset flex flex-col gap-0.5 rounded-2xl px-3.5 py-3">
      <span className="fx-text2 text-xs">{label}</span>
      <span className={cn("fx-num font-bold tracking-[-0.02em]", valueSize)}>{value}</span>
    </div>
  );
}
