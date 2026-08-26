import React from 'react';
import { motion } from 'motion/react';

export function TextShimmerWave({
  children = "Generating...",
  className = "",
  duration = 1.2,
  spread = 1.2
}) {
  const text = typeof children === "string" ? children : "Generating...";
  const letters = Array.from(text);

  return (
    <span className={`inline-flex items-center justify-center select-none font-sans font-medium tracking-tight ${className}`}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block transition-colors"
          initial={{ opacity: 0.3, y: 0 }}
          animate={{
            opacity: [0.25, 1, 0.25],
            y: [0, -3, 0],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index * duration) / (letters.length * spread),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default TextShimmerWave;
