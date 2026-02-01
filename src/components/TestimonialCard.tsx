import React from 'react';
import { motion } from 'framer-motion';
import type { Testimonial } from '../types';

interface TestimonialCardProps {
  item: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item, index }) => {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=D4A5A5&color=fff`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 } as any}
      whileInView={{ opacity: 1, y: 0 } as any}
      viewport={{ once: true } as any}
      transition={{ delay: index * 0.1 } as any}
      className="snap-center w-[320px] sm:w-[500px] md:w-[650px] flex-shrink-0"
    >
      <div className="bg-white rounded-[2rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-100 h-full flex flex-col sm:flex-row overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(212,165,165,0.25)] transition-all duration-500">
        
        {/* Left Side: Portrait Image 9:16 */}
        <div className="w-full sm:w-[40%] md:w-[35%] aspect-[3/4] sm:aspect-[9/16] bg-gray-50 overflow-hidden relative">
          <img 
            src={item.image_url || fallbackAvatar} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackAvatar;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col relative">
          {/* Decorative Quote Mark */}
          <div className="text-primary/10 text-7xl font-serif absolute top-4 right-8 opacity-50 pointer-events-none">"</div>
          
          {/* Rating Stars */}
          <div className="flex gap-1 mb-4 relative z-10">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill={i < (item.rating || 5) ? "#FFD700" : "none"} 
                stroke={i < (item.rating || 5) ? "#FFD700" : "#D1D5DB"}
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="drop-shadow-sm"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          </div>

          <p className="font-sans text-textMain/80 italic leading-relaxed mb-8 relative z-10 line-clamp-6 text-sm md:text-base">
            "{item.content}"
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-50">
            <h4 className="font-serif text-xl text-textMain font-bold tracking-tight">{item.name}</h4>
            <span className="text-xs font-sans text-primary font-bold uppercase tracking-[0.2em] block mt-1">
              {item.role || 'Beautiful Client'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;