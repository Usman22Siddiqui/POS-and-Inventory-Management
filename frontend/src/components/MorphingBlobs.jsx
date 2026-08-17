import React from 'react';
import { motion } from 'framer-motion';

/**
 * MorphingBlobs — Subtle organic morphing gradient background for Login / Empty states
 */
export const MorphingBlobs = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {/* Blob 1: Top Left Lime-Sage Morph */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          x: [-20, 30, -10, -20],
          y: [-20, 20, 40, -20],
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '40% 60% 70% 30% / 50% 60% 30% 60%',
            '70% 30% 50% 50% / 30% 40% 60% 70%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(212, 222, 149, 0.28) 0%, rgba(186, 192, 149, 0.12) 60%, transparent 80%)',
          filter: 'blur(45px)',
        }}
      />

      {/* Blob 2: Bottom Right Moss-Deep Morph */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1],
          x: [20, -30, 15, 20],
          y: [20, -25, -40, 20],
          borderRadius: [
            '40% 60% 60% 40% / 60% 30% 70% 40%',
            '60% 40% 30% 70% / 40% 70% 30% 60%',
            '30% 70% 70% 30% / 50% 30% 70% 50%',
            '40% 60% 60% 40% / 60% 30% 70% 40%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(99, 107, 47, 0.22) 0%, rgba(61, 65, 39, 0.1) 60%, transparent 80%)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  );
};
