import React, { useEffect } from 'react';

/**
 * SmoothScroll: Menghadirkan inersia gulir yang halus dan slow-motion
 * saat pengguna melakukan scroll menggunakan mouse wheel di desktop.
 * Pada perangkat sentuh (touch/mobile), scroll alami momentum bawaan tetap dipertahankan.
 */
export const SmoothScroll: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Hanya aktifkan di browser desktop dengan pointer mouse yang presisi
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
      return;
    }

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let isRunning = false;
    let rafId: number | null = null;

    // Nilai lerp damping untuk efek perlambatan slow-motion yang mewah
    const LERP_FACTOR = 0.072;

    const updateScroll = () => {
      // Periksa apakah modal sedang mengunci scroll
      if (document.body.style.overflow === 'hidden') {
        currentY = window.scrollY;
        targetY = window.scrollY;
        isRunning = false;
        return;
      }

      const diff = targetY - currentY;

      if (Math.abs(diff) > 0.4) {
        currentY += diff * LERP_FACTOR;
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(updateScroll);
      } else {
        window.scrollTo(0, targetY);
        currentY = targetY;
        isRunning = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Jangan mengintervensi jika elemen anak memiliki scroll internal sendiri (misalnya dropdown / modal)
      let targetElement = e.target as HTMLElement | null;
      while (targetElement && targetElement !== document.body) {
        const overflowY = window.getComputedStyle(targetElement).overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          targetElement.scrollHeight > targetElement.clientHeight
        ) {
          return;
        }
        targetElement = targetElement.parentElement;
      }

      // Cegah default scroll kasar browser
      e.preventDefault();

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      // Normalisasi scroll delta untuk berbagai browser/mouse wheel
      const delta = e.deltaY;
      const step = delta * 1.15;

      targetY = Math.min(Math.max(0, targetY + step), maxScroll);

      if (!isRunning) {
        isRunning = true;
        currentY = window.scrollY;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    const handleSyncOnScroll = () => {
      if (!isRunning) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleSyncOnScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleSyncOnScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
