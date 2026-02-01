import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import Button from './ui/Button';

interface TestimonialsProps {
  onSeeFullGallery?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onSeeFullGallery }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Updated: Only show top 10 on home preview

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = direction === 'left' ? -500 : 500;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSuccess = () => {
    fetchTestimonials();
    setShowForm(false);
  };

  return (
    <section id="testimonials" className="py-24 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.span 
          initial={{ opacity: 0 } as any}
          whileInView={{ opacity: 1 } as any}
          viewport={{ once: true } as any}
          className="text-primary font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
        >
          Love Notes
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 } as any}
          whileInView={{ opacity: 1, y: 0 } as any}
          viewport={{ once: true } as any}
          className="font-serif text-5xl md:text-6xl text-textMain"
        >
          Client Stories
        </motion.h2>
        <div className="h-[1px] w-12 bg-primary mx-auto mt-6 opacity-30"></div>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto group px-4">
        <div className="absolute top-0 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none"></div>

        <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('left')}
            className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110 border border-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>

        <div 
          ref={containerRef}
          className="flex gap-8 md:gap-12 overflow-x-auto px-4 md:px-24 py-12 pb-16 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {loading && testimonials.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="snap-center w-[320px] md:w-[650px] flex-shrink-0 animate-pulse">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 h-[450px] flex flex-col md:flex-row overflow-hidden">
                  <div className="w-full md:w-[35%] h-full bg-gray-100"></div>
                  <div className="flex-1 p-10 flex flex-col">
                    <div className="h-6 bg-gray-100 rounded w-1/2 mb-6"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((item, index) => (
              <TestimonialCard key={item.id} item={item} index={index} />
            ))
          ) : (
            <div className="w-full text-center py-24 bg-white/30 backdrop-blur-sm rounded-[3rem] border border-dashed border-primary/20">
              <p className="font-serif text-3xl text-textMain/20 italic">"Goresan kuas adalah bahasa cinta..." ✨</p>
            </div>
          )}
        </div>

        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('right')}
            className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110 border border-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
         <Button 
           onClick={onSeeFullGallery} 
           variant="primary"
           className="px-12 py-5 shadow-xl transform hover:scale-105 min-w-[240px]"
         >
           View Full Gallery
         </Button>
         
         {!showForm ? (
           <Button 
            onClick={() => setShowForm(true)} 
            variant="outline"
            className="px-12 py-5 bg-white shadow-xl border-primary/10 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-105 min-w-[240px]"
           >
             Tulis Testimoni Anda
           </Button>
         ) : (
           <div className="relative w-full max-w-3xl pt-10">
             <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 md:right-10 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-textMain/40 hover:text-primary transition-all shadow-lg border border-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
             <TestimonialForm onSuccess={handleSuccess} />
           </div>
         )}
      </div>
    </section>
  );
};

export default Testimonials;