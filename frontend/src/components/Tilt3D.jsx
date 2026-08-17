import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Tilt3D — Reusable physical 3D frame component
 * 
 * Features:
 * - Mouse-following 3D tilt (rotateX, rotateY capped at 3–7 degrees)
 * - Radial specular light sheen layer tracking cursor
 * - Physical perspective and translateZ depth layers
 * - Smooth spring physics on leave (no jitter)
 * - Auto-disables on touch screens and prefers-reduced-motion
 */
export const Tilt3D = ({
  children,
  className = '',
  style = {},
  maxTilt = 6, // degrees
  depth = 20, // translateZ in px
  enableGlow = true,
  enableFloat = false,
  floatDuration = 6,
  floatDelay = 0,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for silky smooth movement and auto-recovery
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Cursor radial highlight coordinates (0% to 100%)
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  useEffect(() => {
    // Detect touch / mobile
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  const handlePointerMove = (e) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerEnter = () => {
    if (!isTouchDevice && !prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const canAnimate = !isTouchDevice && !prefersReducedMotion;

  return (
    <div
      ref={cardRef}
      className={`tilt-3d-container ${className}`}
      style={{
        perspective: '1000px',
        ...style,
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
    >
      <motion.div
        className="tilt-3d-card"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: canAnimate ? rotateX : 0,
          rotateY: canAnimate ? rotateY : 0,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
        animate={
          enableFloat && canAnimate && !isHovered
            ? {
                y: [-3, 3, -3],
                rotateZ: [-0.6, 0.6, -0.6],
              }
            : { y: 0, rotateZ: 0 }
        }
        transition={
          enableFloat
            ? {
                duration: floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatDelay,
              }
            : {}
        }
      >
        {/* Main Content Layer elevated with translateZ */}
        <div
          style={{
            transform: canAnimate ? `translateZ(${depth}px)` : 'none',
            transformStyle: 'preserve-3d',
            height: '100%',
          }}
        >
          {children}
        </div>

        {/* Specular Radial Light Sheen Layer */}
        {enableGlow && canAnimate && isHovered && (
          <motion.div
            className="tilt-3d-glare"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx} ${gy}, rgba(255, 255, 255, 0.25) 0%, rgba(212, 222, 149, 0.12) 35%, transparent 70%)`
              ),
              mixBlendMode: 'overlay',
              zIndex: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </div>
  );
};
