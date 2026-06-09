import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharacterProps {
  key?: React.Key | number;
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function Character({ char, index, total, progress }: CharacterProps) {
  // Distribute the fade trigger points across the 0-1 scroll progress.
  // We offset the start/end so that the characters light up sequentially and smoothly.
  const start = index / total;
  const end = Math.min(1, start + 0.08); // add a small window for a smooth transition

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block" id={`char-wrap-${index}`}>
      {/* Invisible placeholder for layout and proper text wrap */}
      <span className="opacity-0 select-none pointer-events-none" id={`char-placeholder-${index}`}>
        {char === " " ? "\u00A0" : char}
      </span>
      {/* Absolute positioned animated span */}
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 select-none"
        id={`char-animating-${index}`}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: paragraphRef as any,
    offset: ["start 0.8", "end 0.2"],
  });

  const characters = text.split("");

  return (
    <p
      id="scroll-animated-text"
      ref={paragraphRef}
      className={`relative inline-flex flex-wrap ${className}`}
    >
      {characters.map((char, index) => (
        <Character
          key={index}
          char={char}
          index={index}
          total={characters.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}
