
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      // Scroll by approximately one card width + gap (300px width + 32px gap)
      const scrollAmount = direction === 'left' ? -340 : 340;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonials" className="py-24 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
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

      <div className="relative w-full max-w-[1400px] mx-auto group">
        {/* Gradient Masks for Fade Effect (Sides) */}
        <div className="absolute top-0 left-0 w-12 md:w-32 h-full bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-12 md:w-32 h-full bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none"></div>

        {/* Navigation Button: Prev (Hidden on Mobile) */}
        <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110 border border-white"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>

        {/* Scrollable Container */}
        {/* 
            - overflow-x-auto: Enables native scrolling (touch swipe).
            - no-scrollbar: Hides the scrollbar (utility class).
            - snap-x snap-mandatory: Ensures cards snap to center.
        */}
        <div 
          ref={containerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto px-6 md:px-12 py-10 pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {TESTIMONIALS.map((item, index) => (
            <motion.div 
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="snap-center w-[300px] md:w-[400px] flex-shrink-0"
            >
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 h-full flex flex-col relative group hover:shadow-[0_20px_40px_-10px_rgba(212,165,165,0.2)] transition-all duration-300 hover:-translate-y-2">
                {/* Quote Icon */}
                <div className="text-primary/20 text-6xl font-serif absolute top-4 right-6 opacity-50">"</div>
                
                <p className="font-sans text-textMain/70 italic leading-relaxed mb-6 relative z-10">
                  "{item.content}"
                </p>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-textMain font-bold">{item.name}</h4>
                    <span className="text-xs font-sans text-primary uppercase tracking-widest">{item.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Spacer for right padding in flex container */}
          <div className="w-4 md:w-8 flex-shrink-0"></div>
        </div>

        {/* Navigation Button: Next (Hidden on Mobile) */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110 border border-white"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
