import { AnimatePresence, motion } from "framer-motion";

interface Props {
  theme: "dark" | "light";
}

const width = 14;
const height = 14;
const color = "var(--color-text)";
const strokeWidth = 1.5;

const ThemeIcon = ({ theme }: Props) => {
  const circleMask = {
    moon: {
      cx: 3,
      cy: 3,
      r: 8,
    },
    sun: {
      cx: 0,
      cy: 0,
      r: 0,
    },
  };

  const circleMain = {
    moon: {
      rotate: 0,
    },
    sun: {
      rotate: 45,
    },
  };

  const celestial = {
    moon: { r: 8 },
    sun: { r: 5 },
  };

  const lineProps = {
    stroke: color,
    strokeWidth: strokeWidth as number,
    vectorEffect: "non-scaling-stroke",
  };

  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: i * 0.1,
          type: "spring",
          duration: 0.5,
          bounce: 0,
        },
        opacity: { delay: i * 0.1, duration: 0.1 },
      },
    }),
  };

  const LINE_POSITIONS = [
    { x1: "0", y1: "0", x2: "0", y2: "3" },
    { x1: "8", y1: "6", x2: "10", y2: "4" },
    { x1: "10", y1: "12", x2: "13", y2: "12" },
    { x1: "8", y1: "18", x2: "10", y2: "20" },
    { x1: "0", y1: "25", x2: "0", y2: "22" },
    { x1: "-8", y1: "18", x2: "-10", y2: "20" },
    { x1: "-10", y1: "12", x2: "-13", y2: "12" },
    { x1: "-8", y1: "6", x2: "-10", y2: "4" },
  ];

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      preserveAspectRatio="none"
      width={width}
      height={height}
      fill="var(--color-text)"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={theme === "light" ? "sun" : "moon"}
      variants={circleMain}
      {...lineProps}
    >
      <motion.circle
        cx="9"
        cy="9"
        r="8"
        mask="url(#moon-mask)"
        animate={theme === "light" ? "sun" : "moon"}
        variants={celestial}
        {...lineProps}
      />
      <mask id="moon-mask">
        <rect x="0" y="0" width="18" height="18" fill="#FFF" />
        <motion.circle
          transition={{ ease: "easeIn", duration: 0.25, bounce: 2 }}
          variants={circleMask}
          fill="black"
        />
      </mask>
      <AnimatePresence initial={false}>
        {theme === "light" && (
          <motion.g
            style={{ transform: "rotate(-45deg)" }}
            strokeWidth={1}
            initial={false}
          >
            {LINE_POSITIONS.map((linePos, index) => (
              <motion.line
                x1={linePos.x1}
                x2={linePos.x2}
                y1={linePos.y1}
                y2={linePos.y2}
                variants={drawLine}
                custom={index}
                key={index}
                initial="hidden"
                animate="visible"
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </motion.svg>
  );
};

export default ThemeIcon;
