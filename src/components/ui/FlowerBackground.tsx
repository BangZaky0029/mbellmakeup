import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// A sophisticated 3D-style flower component constructed from SVG layers
const RealisticFlower = ({ className, colorPrimary, colorSecondary, size = 100, ...props }: any) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={className} 
      {...props}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorPrimary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colorSecondary} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g filter="url(#glow)">
        {/* Layer 1: Bottom Petals (Larger, Darker) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <path
            key={`l1-${i}`}
            d="M50 50 C50 20, 30 10, 50 0 C70 10, 50 20, 50 50"
            fill={colorSecondary}
            opacity="0.6"
            transform={`rotate(${angle}, 50, 50) scale(1.1)`}
          />
        ))}

        {/* Layer 2: Middle Petals (Main) */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => (
          <path
            key={`l2-${i}`}
            d="M50 50 C50 25, 35 15, 50 5 C65 15, 50 25, 50 50"
            fill="url(#petalGradient)"
            opacity="0.9"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}

        {/* Layer 3: Inner Petals (Small, Detail) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <path
            key={`l3-${i}`}
            d="M50 50 C50 35, 40 30, 50 20 C60 30, 50 35, 50 50"
            fill="#FFF"
            opacity="0.7"
            transform={`rotate(${angle}, 50, 50) scale(0.6)`}
          />
        ))}

        {/* Center */}
        <circle cx="50" cy="50" r="4" fill="#FFD700" opacity="0.8" />
        <circle cx="50" cy="50" r="2" fill="#FFF" opacity="0.9" />
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

  const springConfig = { stiffness: 50, damping: 20 };
  const scrollSpring = useSpring(scrollYProgress, springConfig);

  // Parallax transforms for different layers
  const yBack = useTransform(scrollSpring, [0, 1], [0, 400]); // Moves slowest (background)
  const yMid = useTransform(scrollSpring, [0, 1], [0, -300]); // Moves reverse
  const yFront = useTransform(scrollSpring, [0, 1], [0, 600]); // Moves fastest (foreground)
  
  const rotateSlow = useTransform(scrollSpring, [0, 1], [0, 60]);
  const rotateFast = useTransform(scrollSpring, [0, 1], [0, -120]);

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full bg-[#FFFCF9]">
      {/* --- ATMOSPHERIC BLURS --- */}
      <motion.div 
        style={{ y: yBack, opacity: 0.4 }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[120px]"
      />
      <motion.div 
        style={{ y: yMid, opacity: 0.3 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-[100px]"
      />

      {/* --- 3D FLOWERS --- */}
      
      {/* 1. Top Right - Large Background Flower */}
      <motion.div
        style={{ y: yBack, rotate: rotateSlow }}
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-5%] opacity-30"
      >
        <RealisticFlower 
          size={400} 
          colorPrimary="#D4A5A5" 
          colorSecondary="#9D8189" 
        />
      </motion.div>

      {/* 2. Middle Left - Floating Mid-ground */}
      <motion.div
        style={{ y: yMid, rotate: rotateFast }}
        animate={{ 
          y: [0, 30, 0],
          x: [0, 15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[-5%] opacity-60"
      >
        <RealisticFlower 
          size={250} 
          colorPrimary="#F4ACB7" 
          colorSecondary="#D4A5A5" 
        />
      </motion.div>

      {/* 3. Bottom Right - Foreground Accent */}
      <motion.div
        style={{ y: yFront, rotate: rotateSlow }}
        animate={{ 
           y: [0, -20, 0],
           rotate: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] opacity-80"
      >
        <RealisticFlower 
          size={150} 
          colorPrimary="#D4A5A5" 
          colorSecondary="#FFF" 
        />
      </motion.div>

      {/* 4. Small Falling Petals */}
      <motion.div
        style={{ y: yFront }}
        className="absolute top-[20%] left-[20%]"
      >
        <motion.div
           animate={{ 
             y: [0, 100, 200],
             x: [0, 50, 0],
             rotate: [0, 180, 360],
             opacity: [0, 1, 0]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 0 C15 0 30 15 15 30 C15 30 0 15 15 0" fill="#D4A5A5" opacity="0.6" />
          </svg>
        </motion.div>
      </motion.div>

       {/* Texture Overlay for Paper Feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
    </div>
  );
};

export default FlowerBackground;