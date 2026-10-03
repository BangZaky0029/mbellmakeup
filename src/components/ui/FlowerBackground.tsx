import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Optimized Flower: Removed expensive SVG Filters (glow)
const RealisticFlower = ({ className, colorPrimary, colorSecondary, size = 100, id, ...props }: any) => {
  // Use unique gradient ID per instance to avoid SVG ID collision
  const gradientId = `petalGrad-${id || 'default'}`;
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`${className}`} 
      {...props}
      style={{ overflow: 'visible', willChange: 'transform' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
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
            fill={`url(#${gradientId})`}
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
      {/* Atmospheric Blurs — disabled on mobile via hidden, shown on md+ */}
      {/* On mobile: simple gradient circles WITHOUT blur for zero GPU cost */}
      <motion.div 
        style={{ y: yBack }}
        className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-primary/10 rounded-full blur-none md:blur-[100px] opacity-30 md:opacity-100"
      />
      <motion.div 
        style={{ y: yMid }}
        className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-secondary/10 rounded-full blur-none md:blur-[80px] opacity-30 md:opacity-100"
      />

      {/* 3D FLOWERS — Top right flower (all screens but smaller on mobile) */}
      <motion.div
        style={{ y: yBack, rotate: rotateSlow }}
        className="absolute top-[-2%] right-[-2%] opacity-10 md:opacity-20"
      >
        <RealisticFlower id="flower-1" size={300} colorPrimary="#D4A5A5" colorSecondary="#9D8189" className="hidden md:block" />
        <RealisticFlower id="flower-1m" size={150} colorPrimary="#D4A5A5" colorSecondary="#9D8189" className="block md:hidden" />
      </motion.div>

      {/* Middle left flower — HIDDEN on mobile to reduce GPU load */}
      <motion.div
        style={{ y: yMid }}
        className="absolute top-[45%] left-[-2%] opacity-40 hidden md:block"
      >
        <RealisticFlower id="flower-2" size={180} colorPrimary="#F4ACB7" colorSecondary="#D4A5A5" />
      </motion.div>

      {/* Bottom right flower — reduced size on mobile */}
      <motion.div
        style={{ y: yFront }}
        className="absolute bottom-[15%] right-[5%] opacity-30 md:opacity-50"
      >
        <RealisticFlower id="flower-3" size={120} colorPrimary="#D4A5A5" colorSecondary="#FFF" className="hidden md:block" />
        <RealisticFlower id="flower-3m" size={60} colorPrimary="#D4A5A5" colorSecondary="#FFF" className="block md:hidden" />
      </motion.div>

      {/* Static Texture Overlay — uses local CSS gradient instead of external URL */}
      <div className="absolute inset-0 opacity-[0.015] hidden md:block" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(74,64,58,0.03) 2px, rgba(74,64,58,0.03) 4px)'
      }}></div>
    </div>
  );
};

export default FlowerBackground;