import React from "react";
import { motion } from "motion/react";

interface FadeInProps {
  key?: React.Key | number;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements | string | any;
  className?: string;
  id?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className = "",
  id,
}: FadeInProps) {
  // Use motion.create to dynamically produce a motion component for the given tag
  const MotionComponent = motion.create(as as any);

  return (
    <MotionComponent
      id={id}
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionComponent>
  );
}
