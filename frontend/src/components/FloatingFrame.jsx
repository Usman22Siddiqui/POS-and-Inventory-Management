import React from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingFrame — Subtle physical floating frame for 3D visual illustrations
 */
export const FloatingFrame = ({
  children,
  className = '',
  style = {},
  duration = 6,
  delay = 0,
  yOffset = 8,
  rotateOffset = 1.5,
}) => {
  return (
    <motion.div
      className={`floating-frame ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        rotateZ: [-rotateOffset, rotateOffset, -rotateOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
