import React from "react";
import { motion } from "framer-motion";

const circleStyle = {
  transform: "rotate(-90deg)",
  transformOrigin: "50%",
  strokeLinecap: "round",
};

interface Props {
  move: number;
  exercise: number;
  heart: number;
  step: number;
}

const EXERCISE_MAX = 60;
const MOVE_MAX = 2000;
const HEART_MAX = 22;
const STEP_MAX = 10000;

const draw = {
  hidden: { strokeDashoffset: 100, opacity: 0 },
  visible: (i) => {
    return {
      strokeDashoffset: i,
      opacity: 1,
    };
  },
};

export default function FitnessRings({ move, exercise, heart, step }: Props) {
  const exercisePercentage = React.useMemo(() => {
    return 100 - (exercise / EXERCISE_MAX) * 100;
  }, [exercise]);

  const movePercentage = React.useMemo(() => {
    return (move / MOVE_MAX) * 100;
  }, [move]);

  const heartPercentage = React.useMemo(() => {
    return (heart / HEART_MAX) * 100;
  }, [heart]);

  const stepPercentage = React.useMemo(() => {
    return (step / STEP_MAX) * 100;
  }, [step]);

  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={200}
      height={200}
      fill="none"
      initial="hidden"
      whileInView="visible"
    >
      <circle
        cx="50%"
        cy="50%"
        stroke="#00dcaf"
        opacity={0.5}
        r={8}
        strokeWidth={1}
      />
      <motion.circle
        cx="50%"
        cy="50%"
        r={8}
        strokeWidth={1}
        stroke="#00dcaf"
        pathLength="100"
        strokeDasharray={100}
        custom={heartPercentage}
        style={circleStyle}
        variants={draw}
        transition={{ duration: 1 }}
      />

      <circle
        cx="50%"
        cy="50%"
        stroke="#659df5"
        opacity={0.5}
        r={6}
        strokeWidth={1}
      />
      <motion.circle
        cx="50%"
        cy="50%"
        r={6}
        strokeWidth={1}
        stroke="#659df5"
        pathLength="100"
        strokeDasharray={100}
        custom={stepPercentage}
        style={circleStyle}
        variants={draw}
        transition={{ duration: 1 }}
      />
      <text x="50%" y="50%" text-anchor="middle" fill="#00dcaf" font-size="4px">
        {heart}
      </text>
      <text x="50%" y="60%" text-anchor="middle" fill="#659df5" font-size="2px">
        {step}
      </text>
    </motion.svg>
  );
}
