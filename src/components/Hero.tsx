import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from './ui/Button'

const Hero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const handleBooking = () => {
    const phoneNumber = "6288293473765";
    const text = "Halo MBELL Makeup, saya ingin reservasi.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="py-1 px-4 border border-textMain/10 rounded-full text-[10px] font-sans tracking-[0.2em] text-textMain/60 uppercase bg-white/50 backdrop-blur-sm">
            Professional Makeup Artist
          </span>
        </motion.div>

        <div className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 text-textMain">
          <motion.div variants={itemVariants}>Enhancing Your</motion.div>
          <motion.div variants={itemVariants} className="italic text-primary">Natural Beauty</motion.div>
        </div>

        <motion.p
          variants={itemVariants}
          className="max-w-lg mx-auto font-sans text-base text-textMain/70 mb-10 leading-relaxed"
        >
          Curating timeless looks for your special moments. Experience the touch of luxury and elegance.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={handleBooking}>Book Appointment</Button>
          <Button variant="outline" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>View Portfolio</Button>
        </motion.div>
      </motion.div>

      {/* Decorative Images - Simplified animation */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.4, x: 0 }}
        className="absolute right-0 top-1/4 w-48 h-72 hidden lg:block gpu-accelerated"
      >
        <img src="https://picsum.photos/id/106/400/600" alt="Decoration" className="w-full h-full object-cover rounded-l-full" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.4, x: 0 }}
        className="absolute left-0 bottom-1/4 w-32 h-56 hidden lg:block gpu-accelerated"
      >
        <img src="https://picsum.photos/id/129/300/500" alt="Decoration" className="w-full h-full object-cover rounded-r-full" />
      </motion.div>
    </section>
  );
};

export default Hero;