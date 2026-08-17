import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

/**
 * CountUpNumber — Smoothly counts up from 0 to value with spring physics
 */
export const CountUpNumber = ({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.2,
}) => {
  const numericVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const count = useMotionValue(0);
  const rounded = useSpring(count, {
    damping: 24,
    stiffness: 100,
  });

  const display = useTransform(rounded, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    count.set(numericVal);
  }, [numericVal, count]);

  return <motion.span>{display}</motion.span>;
};
