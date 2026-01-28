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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (onLinkClick) {
      onLinkClick();
    }

    performScroll(href);
  };

  const performScroll = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', href);
    }
  };

  const handleBooking = () => {
    const phoneNumber = "6288293473765";
    const text = "Halo MBELL Makeup, saya ingin melakukan reservasi untuk appointment makeup. Boleh info pricelist dan availability?";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsMobileMenuOpen(false);
    if (onLinkClick) onLinkClick();
  };

  const showBackground = isScrolled || isOverlay;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
          showBackground
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <motion.a 
            href="#home"
            onClick={(e) => handleSmoothScroll(e, '#home')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-2xl font-serif font-semibold tracking-wider text-textMain relative group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 relative overflow-hidden">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain relative z-10" />
            </div>
            
            <span className="hidden sm:inline-block">
              MBell MakeUp
            </span>
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm font-sans tracking-wide text-textMain/80 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBooking}
              className="px-6 py-2 bg-textMain text-white text-xs uppercase tracking-widest rounded-full hover:bg-primary transition-colors duration-300 shadow-md"
            >
              Book Now
            </motion.button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col space-y-1.5 focus:outline-none z-[120] p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="w-8 h-0.5 bg-textMain block" />
            <span className="w-5 h-0.5 bg-textMain block ml-auto" />
            <span className="w-8 h-0.5 bg-textMain block" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white flex flex-col"
          >
            {/* Header in Overlay */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <img src={logo} alt="Logo" className="w-7 h-7 object-contain opacity-50" />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-textMain p-2 hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Links Section */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-2xl font-serif text-textMain/80 hover:text-primary transition-colors tracking-wide"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-8"
              >
                <button 
                  onClick={handleBooking}
                  className="px-12 py-4 bg-primary/80 hover:bg-primary text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full shadow-xl transition-all active:scale-95"
                >
                  Book Appointment
                </button>
              </motion.div>
            </div>

            {/* Bottom Decoration */}
            <div className="py-12 flex justify-center opacity-10">
               <span className="font-serif italic text-4xl">MBell</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;