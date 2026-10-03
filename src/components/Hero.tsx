import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from './ui/Button'
import bella1 from '../assets/bella_1.png'

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
    const element = document.getElementById('contact');
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
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
        
        {/* Left: Typography (Overlapping) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 col-span-12 lg:col-span-7 text-center lg:text-left pt-10 lg:pt-0"
        >
          <motion.div variants={itemVariants} className="mb-6 lg:mb-8">
            <span className="py-1.5 px-5 border border-primary/20 rounded-full text-[9px] md:text-[10px] font-sans font-bold tracking-[0.25em] text-primary uppercase bg-white/70 backdrop-blur-md shadow-sm">
              Professional Makeup Artist
            </span>
          </motion.div>

          <div className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[1.1] mb-6 lg:mb-8 text-textMain mix-blend-multiply">
            <motion.div variants={itemVariants} className="font-medium tracking-tight">Enhancing Your</motion.div>
            <motion.div variants={itemVariants} className="italic text-primary font-light relative inline-block">
              <span className="relative z-10">Natural Beauty</span>
              <div className="absolute bottom-2 left-0 right-0 h-3 bg-primary/10 -z-10 rounded-full"></div>
            </motion.div>
          </div>

          <motion.p
            variants={itemVariants}
            className="max-w-md mx-auto lg:mx-0 font-sans text-sm md:text-base text-textMain/70 mb-10 leading-relaxed"
          >
            Curating timeless looks for your special moments. Experience the touch of luxury and elegance designed exclusively for you.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="primary" onClick={handleBooking} className="shadow-lg hover:shadow-xl hover:-translate-y-1">Book Appointment</Button>
            <Button variant="outline" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/50 backdrop-blur hover:bg-white">Explore Portfolio</Button>
          </motion.div>
        </motion.div>

        {/* Right: Editorial Image (Arch/Rounded) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, x: 20 }}
           animate={{ opacity: 1, scale: 1, x: 0 }}
           transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
           className="relative z-10 col-span-12 lg:col-span-5 w-full flex justify-center lg:justify-end lg:-ml-12"
        >
          <div className="relative w-[280px] sm:w-[340px] lg:w-[420px] aspect-[3/4] md:aspect-[4/5] rounded-[3rem] sm:rounded-[4rem] lg:rounded-t-full lg:rounded-b-[4rem] overflow-hidden bg-gray-50 border-4 sm:border-8 border-white shadow-[0_30px_60px_-15px_rgba(212,165,165,0.3)]">
            <img src={bella1} alt="Bella Makeup Artistry" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000" />
            
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Element */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 lg:bottom-12 lg:-left-12 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-white flex items-center gap-4 hidden sm:flex"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl font-bold text-textMain leading-none">Premium</p>
              <p className="font-sans text-[9px] sm:text-[10px] text-textMain/60 uppercase tracking-widest mt-1">MakeUp Service</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Blur Background Element */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 hidden lg:block"></div>
    </section>
  );
};

export default Hero;