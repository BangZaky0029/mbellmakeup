import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Siluet Bunga Melati (Jasmine Star Blossom) - Anggun & Bersih
const JasmineBlossom = ({
  id,
  size = 120,
  className = '',
  colorPrimary = '#C88A82',
  colorSecondary = '#EBD8D0',
}: {
  id: string;
  size?: number;
  className?: string;
  colorPrimary?: string;
  colorSecondary?: string;
}) => {
  const gradientId = `jasmineGrad-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible', willChange: 'transform' }}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colorSecondary} stopOpacity="0.85" />
          <stop offset="70%" stopColor={colorPrimary} stopOpacity="0.55" />
          <stop offset="100%" stopColor={colorPrimary} stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* 5 Kelopak Bintang Melati Tradisional */}
      <g transform="translate(50, 50)">
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path
            key={`petal-${i}`}
            d="M 0,0 C -12,-20 -15,-40 0,-48 C 15,-40 12,-20 0,0 Z"
            fill={`url(#${gradientId})`}
            transform={`rotate(${angle})`}
            className="transition-transform duration-700"
          />
        ))}

        {/* Lingkaran Putik Bunga Emas / Rose */}
        <circle cx="0" cy="0" r="4.5" fill="#C5A059" opacity="0.8" />
        <circle cx="0" cy="0" r="2" fill="#FCF9F6" opacity="0.9" />
      </g>
    </svg>
  );
};

// Siluet Kelopak Mawar Pengantin (Single Curved Rose Petal)
const RosePetal = ({
  size = 24,
  opacity = 0.5,
  color = '#C88A82',
}: {
  size?: number;
  opacity?: number;
  color?: string;
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      style={{ opacity, willChange: 'transform' }}
    >
      <defs>
        <linearGradient id={`rosePetalGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF1ED" stopOpacity="0.95" />
          <stop offset="60%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9E5A54" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M 20 2 C 32 10 38 25 24 36 C 14 38 4 30 6 18 C 8 8 15 2 20 2 Z"
        fill={`url(#rosePetalGrad-${size})`}
      />
    </svg>
  );
};

// Konfigurasi 6 Kelopak Melayang Halus (Ringan di GPU & Mobile)
const DRIFTING_PETALS = [
  { left: '9%', size: 22, duration: 16, delay: 0, sway: 'petal-sway-1', opacity: 0.45 },
  { left: '26%', size: 16, duration: 20, delay: 4, sway: 'petal-sway-2', opacity: 0.35 },
  { left: '48%', size: 20, duration: 18, delay: 8, sway: 'petal-sway-3', opacity: 0.4 },
  { left: '71%', size: 24, duration: 15, delay: 2, sway: 'petal-sway-1', opacity: 0.5 },
  { left: '88%', size: 18, duration: 22, delay: 6, sway: 'petal-sway-2', opacity: 0.35 },
  { left: '94%', size: 15, duration: 19, delay: 11, sway: 'petal-sway-3', opacity: 0.3 },
];

export const FlowerBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Parallax shifts for atmospheric background corner blossoms
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const rotateSlow = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full bg-[#FCF9F6]">
      {/* ── 1. Atmospheric Ambient Glow Gradients ─────────────────────── */}
      <motion.div
        style={{ y: yBack }}
        className="absolute top-0 right-0 w-[240px] md:w-[480px] aspect-square bg-[#EBD8D0]/35 rounded-full blur-[110px]"
      />
      <motion.div
        style={{ y: yMid }}
        className="absolute bottom-0 left-0 w-[200px] md:w-[380px] aspect-square bg-[#F4EBE6]/60 rounded-full blur-[100px]"
      />

      {/* ── 2. Layer 1: Corner Parallax Botanical Blossoms ────────────── */}
      {/* Pojok Kanan Atas */}
      <motion.div
        style={{ y: yBack, rotate: rotateSlow }}
        className="absolute top-[-3%] right-[-3%] opacity-[0.08]"
      >
        <JasmineBlossom id="flower-tr" size={300} colorPrimary="#C88A82" colorSecondary="#EBD8D0" className="hidden md:block" />
        <JasmineBlossom id="flower-tr-m" size={150} colorPrimary="#C88A82" colorSecondary="#EBD8D0" className="block md:hidden" />
      </motion.div>

      {/* Sisi Kiri Tengah */}
      <motion.div
        style={{ y: yMid }}
        className="absolute top-[42%] left-[-2.5%] opacity-[0.07] hidden md:block"
      >
        <JasmineBlossom id="flower-ml" size={180} colorPrimary="#9E5A54" colorSecondary="#C88A82" />
      </motion.div>

      {/* Pojok Kanan Bawah */}
      <motion.div
        style={{ y: yFront }}
        className="absolute bottom-[12%] right-[3%] opacity-[0.08]"
      >
        <JasmineBlossom id="flower-br" size={140} colorPrimary="#C88A82" colorSecondary="#FCF9F6" className="hidden md:block" />
        <JasmineBlossom id="flower-br-m" size={70} colorPrimary="#C88A82" colorSecondary="#FCF9F6" className="block md:hidden" />
      </motion.div>

      {/* ── 3. Layer 2: Ethereal Drifting Rose Petals (100% GPU CSS) ──── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DRIFTING_PETALS.map((petal, idx) => (
          <div
            key={`petal-drift-${idx}`}
            className="petal-floating absolute top-0"
            style={{
              left: petal.left,
              animation: `petal-fall ${petal.duration}s linear ${petal.delay}s infinite`,
              willChange: 'transform',
            }}
          >
            <div
              style={{
                animation: `${petal.sway} ${Math.round(petal.duration / 3.5)}s ease-in-out infinite`,
                willChange: 'transform',
              }}
            >
              <RosePetal size={petal.size} opacity={petal.opacity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowerBackground;