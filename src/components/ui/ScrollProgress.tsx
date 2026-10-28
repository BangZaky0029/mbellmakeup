import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Spring physics for silky-smooth progress tracking
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[130] h-[2px] bg-gradient-to-r from-mbell-primary via-mbell-rose to-mbell-primary origin-left pointer-events-none shadow-[0_1px_4px_rgba(158,90,84,0.3)]"
    />
  );
};

export default ScrollProgress;
