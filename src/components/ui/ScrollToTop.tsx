import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan tombol saat scroll melewati 420px (setelah Hero section)
      setIsVisible(window.scrollY > 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          onClick={scrollToTop}
          type="button"
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full bg-mbell-canvas/90 backdrop-blur-md border border-mbell-border text-mbell-ink shadow-[0_4px_16px_rgba(42,33,33,0.08)] hover:bg-mbell-surface hover:text-mbell-primary hover:border-mbell-rose transition-all flex items-center justify-center active:scale-95 group focus:outline-none focus:ring-2 focus:ring-mbell-rose/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform transition-transform group-hover:-translate-y-0.5"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
