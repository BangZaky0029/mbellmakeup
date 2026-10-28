import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const RealisticFlower = ({ className, colorPrimary, colorSecondary, size = 100, id, ...props }: any) => {
  const gradientId = `petalGrad-${id || 'default'}`;
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={className} 
      {...props}
      style={{ overflow: 'visible', willChange: 'transform' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorPrimary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colorSecondary} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g>
        {[0, 120, 240].map((angle, i) => (
          <path
            key={`l1-${i}`}
            d="M50 50 C50 20, 30 10, 50 0 C70 10, 50 20, 50 50"
            fill={colorSecondary}
            opacity="0.35"
            transform={`rotate(${angle}, 50, 50) scale(1.1)`}
          />
        ))}

        {[60, 180, 300].map((angle, i) => (
          <path
            key={`l2-${i}`}
            d="M50 50 C50 25, 35 15, 50 5 C65 15, 50 25, 50 50"
            fill={`url(#${gradientId})`}
            opacity="0.75"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}

        <circle cx="50" cy="50" r="3" fill="#C88A82" opacity="0.7" />
      </g>
    </svg>
  );
};

const FlowerBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();

  const yBack = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateSlow = useTransform(scrollYProgress, [0, 1], [0, 35]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full bg-[#FCF9F6]">
      {/* Subtle Atmospheric Gradients */}
      <motion.div 
        style={{ y: yBack }}
        className="absolute top-0 right-0 w-[240px] md:w-[450px] aspect-square bg-[#EBD8D0]/30 rounded-full blur-[100px]"
      />
      <motion.div 
        style={{ y: yMid }}
        className="absolute bottom-0 left-0 w-[200px] md:w-[350px] aspect-square bg-[#F4EBE6]/60 rounded-full blur-[90px]"
      />

      {/* Top right flower (Subtle 8% Opacity) */}
      <motion.div
        style={{ y: yBack, rotate: rotateSlow }}
        className="absolute top-[-2%] right-[-2%] opacity-[0.08]"
      >
        <RealisticFlower id="flower-1" size={280} colorPrimary="#C88A82" colorSecondary="#EBD8D0" className="hidden md:block" />
        <RealisticFlower id="flower-1m" size={140} colorPrimary="#C88A82" colorSecondary="#EBD8D0" className="block md:hidden" />
      </motion.div>

      {/* Middle left flower (Subtle 7% Opacity) */}
      <motion.div
        style={{ y: yMid }}
        className="absolute top-[45%] left-[-2%] opacity-[0.07] hidden md:block"
      >
        <RealisticFlower id="flower-2" size={160} colorPrimary="#9E5A54" colorSecondary="#C88A82" />
      </motion.div>

      {/* Bottom right flower (Subtle 8% Opacity) */}
      <motion.div
        style={{ y: yFront }}
        className="absolute bottom-[15%] right-[4%] opacity-[0.08]"
      >
        <RealisticFlower id="flower-3" size={120} colorPrimary="#C88A82" colorSecondary="#FCF9F6" className="hidden md:block" />
        <RealisticFlower id="flower-3m" size={60} colorPrimary="#C88A82" colorSecondary="#FCF9F6" className="block md:hidden" />
      </motion.div>
    </div>
  );
};

export default FlowerBackground;