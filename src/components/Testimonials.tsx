import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary font-sans font-bold tracking-widest uppercase text-sm mb-4 block"
        >
          Love Notes
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-textMain"
        >
          Client Testimonials
        </motion.h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks for Fade Effect */}
        <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none"></div>

        {/* Moving Container */}
        <motion.div 
          className="flex gap-8 w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 30 
          }}
        >
          {/* Double the list to create seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="w-[300px] md:w-[400px] flex-shrink-0"
            >
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 h-full flex flex-col relative group hover:shadow-[0_20px_40px_-10px_rgba(212,165,165,0.2)] transition-shadow duration-300">
                {/* Quote Icon */}
                <div className="text-primary/20 text-6xl font-serif absolute top-4 right-6 opacity-50">"</div>
                
                <p className="font-sans text-textMain/70 italic leading-relaxed mb-6 relative z-10">
                  "{item.content}"
                </p>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-textMain font-bold">{item.name}</h4>
                    <span className="text-xs font-sans text-primary uppercase tracking-widest">{item.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;