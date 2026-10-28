import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import logo from '../assets/logoBrand.png';

interface NavbarProps {
  isOverlay?: boolean;
  onLinkClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOverlay = false, onLinkClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll safely without layout shifting or exit glitch
  useEffect(() => {
    let timeoutId: any;
    if (isMobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Delay releasing scroll lock until exit animation completes (300ms) to prevent repaint jerk
      timeoutId = setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 300);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const performScroll = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      window.history.pushState(null, '', href);
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (onLinkClick) {
      onLinkClick();
    }

    // Delay smooth scrolling until menu finishes closing to avoid animation drop/glitch
    setTimeout(() => {
      performScroll(href);
    }, 200);
  };

  const handleBooking = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onLinkClick) onLinkClick();
    setTimeout(() => {
      performScroll('#contact');
    }, 200);
  };

  const showBackground = isScrolled || isOverlay;

  // Staggered variants for opening menu
  const navListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.05
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${showBackground
            ? 'bg-mbell-canvas/90 backdrop-blur-md shadow-[0_2px_15px_rgba(42,33,33,0.04)] border-b border-mbell-border py-3.5'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex justify-between items-center">
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, '#home')}
            className="flex items-center gap-3 text-xl sm:text-2xl font-serif font-medium tracking-tight text-mbell-ink group"
          >
            <div className="w-10 h-10 rounded-full bg-mbell-surface border border-mbell-border flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <img src={logo} alt="MBell MakeUp Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif tracking-normal text-mbell-ink">
              MBell MakeUp
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-sm font-sans font-medium text-mbell-muted hover:text-mbell-ink transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleBooking}
              className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 rounded-full bg-mbell-primary text-mbell-canvas text-xs font-semibold tracking-wider hover:bg-mbell-ink transition-colors shadow-sm"
            >
              Cek Jadwal
            </button>
          </nav>

          {/* Mobile Hamburger Button (Accessible Touch Target) */}
          <button
            type="button"
            aria-label="Buka menu navigasi"
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-mbell-surface border border-mbell-border text-mbell-ink focus:outline-none focus:ring-2 focus:ring-mbell-rose active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Smooth Overlay & Staggered Menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1000] md:hidden overscroll-contain"
          >
            {/* Backdrop Blur Overlay */}
            <div
              className="absolute inset-0 bg-black/25 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              key="mobile-menu-panel"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-mbell-canvas flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Header (Exact alignment with navbar) */}
              <div className={`w-full border-b border-mbell-border ${showBackground ? 'py-3.5' : 'py-5'} transition-all`}>
                <div className="max-w-6xl mx-auto px-5 sm:px-8 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mbell-surface border border-mbell-border flex items-center justify-center p-1.5">
                      <img src={logo} alt="MBell MakeUp" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">
                      MBell MakeUp
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Tutup menu navigasi"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-11 h-11 rounded-full bg-mbell-surface border border-mbell-border flex items-center justify-center text-mbell-ink hover:text-mbell-primary active:scale-95 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Items (Touch Target >= 48px, Staggered Flow) */}
              <motion.div
                variants={navListVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col justify-center px-7 sm:px-12 space-y-2 overflow-y-auto overscroll-contain py-4"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.name} variants={navItemVariants}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="flex items-center justify-between min-h-[52px] font-serif text-2xl text-mbell-ink hover:text-mbell-primary border-b border-mbell-border/60 transition-colors py-2 group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                        {link.name}
                      </span>
                      <span className="text-xs font-sans text-mbell-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>

              {/* Drawer Bottom Quick Action */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 border-t border-mbell-border bg-mbell-surface/50"
              >
                <button
                  onClick={handleBooking}
                  className="w-full min-h-[50px] rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-sm flex items-center justify-center shadow-md active:scale-98 transition-transform hover:bg-mbell-ink"
                >
                  Cek Jadwal & Pesan Riasan
                </button>
                <p className="text-center font-sans text-xs text-mbell-muted mt-3">
                  Bella Aprilian — Professional Makeup Artist
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;