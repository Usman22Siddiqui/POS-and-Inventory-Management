import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCheckmark — SVG checkmark that draws itself smoothly
 */
export const AnimatedCheckmark = ({ size = 54, color = '#636B2F' }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(212, 222, 149, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px auto',
        boxShadow: '0 8px 24px rgba(99, 107, 47, 0.2)',
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M4 12.5L9.5 18L20 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.65,
            ease: [0.65, 0, 0.35, 1],
            delay: 0.2,
          }}
        />
      </svg>
    </div>
  );
};
