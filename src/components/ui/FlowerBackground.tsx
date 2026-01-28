import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Optimized Flower: Removed expensive SVG Filters (glow)
const RealisticFlower = ({ className, colorPrimary, colorSecondary, size = 100, ...props }: any) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`${className} gpu-accelerated`} 
      {...props}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorPrimary} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colorSecondary} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g>
        {/* Simplified Layers for performance */}
        {[0, 120, 240].map((angle, i) => (
          <path
            key={`l1-${i}`}
            d="M50 50 C50 20, 30 10, 50 0 C70 10, 50 20, 50 50"
            fill={colorSecondary}
            opacity="0.4"
            transform={`rotate(${angle}, 50, 50) scale(1.1)`}
          />
        ))}

        {[60, 180, 300].map((angle, i) => (
          <path
            key={`l2-${i}`}
            d="M50 50 C50 25, 35 15, 50 5 C65 15, 50 25, 50 50"
            fill="url(#petalGradient)"
            opacity="0.8"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}

        {/* Core center */}
        <circle cx="50" cy="50" r="3" fill="#FFD700" opacity="0.8" />
      </g>
    </svg>
  );
};

const FlowerBackground: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Switch to useTransform directly instead of useSpring for less calculation jitter
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  const rotateSlow = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full bg-[#FFFCF9]">
      {/* Atmospheric Blurs - simplified */}
      <motion.div 
        style={{ y: yBack }}
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] gpu-accelerated"
      />
      <motion.div 
        style={{ y: yMid }}
        className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] gpu-accelerated"
      />

      {/* 3D FLOWERS - Reduced quantity and simplified animation */}
      <motion.div
        style={{ y: yBack, rotate: rotateSlow }}
        className="absolute top-[-2%] right-[-2%] opacity-20"
      >
        <RealisticFlower size={300} colorPrimary="#D4A5A5" colorSecondary="#9D8189" />
      </motion.div>

      <motion.div
        style={{ y: yMid }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[45%] left-[-2%] opacity-40"
      >
        <RealisticFlower size={180} colorPrimary="#F4ACB7" colorSecondary="#D4A5A5" />
      </motion.div>

      <motion.div
        style={{ y: yFront }}
        className="absolute bottom-[15%] right-[5%] opacity-50"
      >
        <RealisticFlower size={120} colorPrimary="#D4A5A5" colorSecondary="#FFF" />
      </motion.div>

      {/* Static Texture Overlay is faster than dynamic grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
    </div>
  );
};

export default FlowerBackground;