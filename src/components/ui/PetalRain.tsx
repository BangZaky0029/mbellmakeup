import React from 'react';

// Siluet Kelopak Mawar Lembut (Minimalist Soft Translucent Rose Petal SVG)
const SmallPetal = ({
  size = 13,
  fillColor = '#C88A82',
  gradientId = 'petal-grad',
}: {
  size?: number;
  fillColor?: string;
  gradientId?: string;
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="filter blur-[0.2px] drop-shadow-[0_2px_6px_rgba(200,138,130,0.22)]"
      style={{ willChange: 'transform' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7F4" stopOpacity="0.75" />
          <stop offset="55%" stopColor={fillColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9E5A54" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M 16 2 C 25 8 30 20 19 29 C 11 31 3 24 5 14 C 7 6 12 2 16 2 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

// Konfigurasi 7 Kelopak Rintik Hujan di Latar Belakang (Jatuh Pelan, Halus & Bergantian)
const RAIN_PETALS = [
  { left: '6%', size: 14, duration: 20, delay: 0, sway: 'petal-rain-sway', color: '#C88A82' },
  { left: '21%', size: 11, duration: 24, delay: 6.5, sway: 'petal-rain-sway-alt', color: '#D9A29B' },
  { left: '38%', size: 15, duration: 22, delay: 13, sway: 'petal-rain-sway', color: '#C88A82' },
  { left: '55%', size: 12, duration: 25, delay: 3, sway: 'petal-rain-sway-alt', color: '#EBD8D0' },
  { left: '71%', size: 16, duration: 19, delay: 9.5, sway: 'petal-rain-sway', color: '#C88A82' },
  { left: '85%', size: 13, duration: 26, delay: 15.5, sway: 'petal-rain-sway-alt', color: '#D9A29B' },
  { left: '94%', size: 11, duration: 23, delay: 18, sway: 'petal-rain-sway', color: '#C88A82' },
];

export const PetalRain: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-75"
    >
      {RAIN_PETALS.map((petal, index) => (
        <div
          key={`petal-rain-${index}`}
          className="petal-rain-item absolute"
          style={{
            left: petal.left,
            animation: `petal-rain-fall ${petal.duration}s linear ${petal.delay}s infinite backwards`,
            willChange: 'transform, top, opacity',
          }}
        >
          <div
            style={{
              animation: `${petal.sway} ${Math.round(petal.duration / 4)}s ease-in-out infinite alternate`,
              willChange: 'transform',
            }}
          >
            <SmallPetal
              size={petal.size}
              fillColor={petal.color}
              gradientId={`rain-grad-${index}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetalRain;
