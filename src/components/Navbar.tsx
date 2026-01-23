import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import logo from '../assets/logoBrand.png'; // ✅ import benar

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
      
      // Calculate offset position (header height ~80px)
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash smoothly
      window.history.pushState(null, '', href);
    }
  };

  const handleBooking = () => {
    const phoneNumber = "6288293473765";
    const text = "Halo MBELL Makeup, saya ingin melakukan reservasi untuk appointment makeup. Boleh info pricelist dan availability?";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
        isScrolled || isMobileMenuOpen
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
          {/* Logo Icon */}
          {/* Logo Icon */}
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <img src={logo} alt="Logo" className="w-20 h-25" />
          </div>


          
          <span>
            MBell MakeUp
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
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
            className="px-6 py-2 bg-textMain text-white text-xs uppercase tracking-widest rounded-full hover:bg-primary transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Book Now
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <motion.span 
            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }} 
            className="w-8 h-0.5 bg-textMain block transition-colors" 
          />
          <motion.span 
            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} 
            className="w-6 h-0.5 bg-textMain block ml-auto transition-colors" 
          />
          <motion.span 
            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }} 
            className="w-8 h-0.5 bg-textMain block transition-colors" 
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col py-8 px-6 space-y-6 text-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-lg font-serif text-textMain hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
               <button 
                onClick={handleBooking}
                className="mt-4 px-8 py-3 bg-primary text-white text-sm uppercase tracking-widest rounded-full mx-auto block shadow-md"
               >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;