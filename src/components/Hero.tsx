import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from './ui/Button'

const Hero: React.FC = () => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  const wordVariants: Variants = {
     hidden: { opacity: 0, y: 50 },
     visible: { 
       opacity: 1, 
       y: 0,
       transition: { duration: 0.8, ease: "easeOut" }
     }
  };

  const handleBooking = () => {
    const phoneNumber = "6288293473765";
    const text = "Halo MBELL Makeup, saya ingin melakukan reservasi untuk appointment makeup. Boleh info pricelist dan availability?";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleViewPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        
        {/* Intro Tag */}
        <motion.div variants={itemVariants} className="mb-6 inline-block">
          <span className="py-1 px-4 border border-textMain/20 rounded-full text-xs font-sans tracking-[0.2em] text-textMain/70 uppercase bg-white/30 backdrop-blur-sm">
            Professional Makeup Artist
          </span>
        </motion.div>

        {/* Main Headline */}
        <div className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 text-textMain flex flex-col items-center">
          {/* Line 1 */}
          <div className="flex gap-4 overflow-hidden">
             <motion.span variants={wordVariants} className="inline-block origin-bottom">
               Enhancing
             </motion.span>
             <motion.span variants={wordVariants} className="inline-block origin-bottom">
               Your
             </motion.span>
          </div>
          
          {/* Line 2 (Italic & Gradient) */}
          <div className="flex gap-4 overflow-hidden py-2"> {/* Added py-2 to prevent italic clip */}
             <motion.span 
               variants={wordVariants} 
               className="inline-block origin-bottom italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient"
             >
               Natural
             </motion.span>
             <motion.span 
               variants={wordVariants} 
               className="inline-block origin-bottom italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient"
             >
               Beauty
             </motion.span>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto font-sans text-lg text-textMain/70 mb-10 leading-relaxed"
        >
          Curating timeless looks for weddings, special events, and editorial shoots. 
          Experience the touch of luxury and elegance.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" onClick={handleBooking}>Book Appointment</Button>
          <Button variant="outline" onClick={handleViewPortfolio}>View Portfolio</Button>
        </motion.div>
      </motion.div>

      {/* Decorative Image Elements (Floating) */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 5 }}
        animate={{ opacity: 0.8, x: 0, rotate: 0 }}
        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
        className="absolute right-0 top-1/3 w-64 h-80 hidden lg:block opacity-80"
      >
        <img 
            src="https://picsum.photos/id/106/400/600" 
            alt="Decoration" 
            className="w-full h-full object-cover rounded-l-full shadow-2xl sepia-[0.3]"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -5 }}
        animate={{ opacity: 0.8, x: 0, rotate: 0 }}
        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
        className="absolute left-0 bottom-20 w-48 h-64 hidden lg:block opacity-80"
      >
        <img 
            src="https://picsum.photos/id/129/300/500" 
            alt="Decoration" 
            className="w-full h-full object-cover rounded-r-full shadow-2xl sepia-[0.3]"
        />
      </motion.div>
    </section>
  );
};

export default Hero;