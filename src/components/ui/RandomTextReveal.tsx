import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RandomTextRevealProps {
  text?: string;
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  delayBase?: number;
  duration?: number;
}

/**
 * RandomTextReveal: Memecah teks menjadi kata-kata dan memunculkannya
 * secara acak (randomized timing), lembut, dan slow-motion saat pengguna
 * melakukan scroll ke elemen tersebut.
 */
export const RandomTextReveal: React.FC<RandomTextRevealProps> = ({
  text,
  children,
  as: Component = 'div',
  className = '',
  delayBase = 0.05,
  duration = 0.95,
}) => {
  const content = text || (typeof children === 'string' ? children : '');

  // Pecah string teks menjadi array kata
  const words = useMemo(() => {
    if (!content) return [];
    return content.trim().split(/\s+/);
  }, [content]);

  // Jika children bukan sekadar string murni, gunakan container pembungkus dengan animasi slowmo
  if (!words.length && children) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-6% 0px' }}
        transition={{ duration, delay: delayBase, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={`inline-block flex-wrap ${className}`}>
      {words.map((word, index) => {
        // Hitung pseudo-random delay deterministik (antara 0.04s - 0.38s)
        // agar stabil antar render namun terlihat acak secara alami
        const pseudoRandom = Math.abs(Math.sin(index * 9.876 + 1.234));
        const randomDelay = delayBase + pseudoRandom * 0.35;

        return (
          <motion.span
            key={`word-${index}-${word}`}
            initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{
              duration,
              delay: randomDelay,
              ease: [0.16, 1, 0.3, 1], // Slow-motion luxury curve
            }}
            className="inline-block mr-[0.28em] last:mr-0 will-change-transform"
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default RandomTextReveal;
