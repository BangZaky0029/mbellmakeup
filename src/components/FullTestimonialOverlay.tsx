import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types';
import TestimonialCard from './TestimonialCard';
import Navbar from './Navbar';
import Footer from './Footer';
import FlowerBackground from './ui/FlowerBackground';
import Button from './ui/Button';

interface FullTestimonialOverlayProps {
  onClose: () => void;
}

const FullTestimonialOverlay: React.FC<FullTestimonialOverlayProps> = ({ onClose }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(4); // Updated: initially 4

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    fetchTestimonials();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(4);
  }, [filterRating]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = useMemo(() => {
    if (filterRating === 'all') return testimonials;
    return testimonials.filter(t => t.rating === filterRating);
  }, [testimonials, filterRating]);

  const displayedTestimonials = useMemo(() => {
    return filteredTestimonials.slice(0, visibleCount);
  }, [filteredTestimonials, visibleCount]);

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" } as any}
      animate={{ opacity: 1, y: 0 } as any}
      exit={{ opacity: 0, y: "100%" } as any}
      transition={{ type: "spring", damping: 30, stiffness: 100 } as any}
      className="fixed inset-0 z-[9000] bg-surface flex flex-col overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <FlowerBackground />
      </div>

      <div className="absolute top-0 left-0 right-0 z-[150]">
        <Navbar isOverlay={true} onLinkClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto pt-32 pb-20 px-6 relative z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 relative">
            {/* Back Menu Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 } as any}
              animate={{ opacity: 1, x: 0 } as any}
              onClick={onClose}
              className="absolute left-0 top-0 hidden md:flex items-center gap-2 px-6 py-2.5 bg-white/50 backdrop-blur rounded-full border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span className="font-sans font-bold text-[10px] uppercase tracking-widest">Kembali</span>
            </motion.button>

            <motion.span 
              initial={{ opacity: 0 } as any}
              animate={{ opacity: 1 } as any}
              className="text-primary font-sans font-bold tracking-[0.4em] uppercase text-xs mb-4 block"
            >
              Gallery of Happiness
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 } as any}
              animate={{ opacity: 1, scale: 1 } as any}
              className="font-serif text-5xl md:text-7xl text-textMain mb-8"
            >
              Real Stories
            </motion.h2>
            
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button 
                onClick={() => setFilterRating('all')}
                className={`px-6 py-2 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest transition-all ${filterRating === 'all' ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white/50 text-textMain hover:bg-white'}`}
              >
                All Stories
              </button>
              {[5, 4, 3, 2, 1].map(star => (
                <button 
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-5 py-2 rounded-full flex items-center gap-2 font-sans font-bold text-[10px] uppercase tracking-widest transition-all ${filterRating === star ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white/50 text-textMain hover:bg-white'}`}
                >
                  <span className="flex">
                    {[...Array(star)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ))}
                  </span>
                  {star} Stars
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex justify-center py-40">
                <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
              </div>
            ) : displayedTestimonials.length > 0 ? (
              <div className="space-y-12">
                <motion.div 
                  layout
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
                >
                  {displayedTestimonials.map((item, index) => (
                    <div key={item.id} className="flex justify-center">
                      <TestimonialCard item={item} index={index} />
                    </div>
                  ))}
                </motion.div>

                {/* See More Button */}
                {filteredTestimonials.length > visibleCount && (
                  <motion.div 
                    initial={{ opacity: 0 } as any}
                    animate={{ opacity: 1 } as any}
                    className="flex justify-center pt-8"
                  >
                    <Button 
                      onClick={handleSeeMore}
                      variant="outline"
                      className="px-12 py-4 bg-white/50 border-primary/20 text-primary hover:bg-primary hover:text-white shadow-lg flex items-center gap-2 group"
                    >
                      <span className="font-sans font-bold text-xs">Lihat Lebih Banyak</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 } as any}
                animate={{ opacity: 1 } as any}
                className="py-40 text-center"
              >
                <p className="font-serif text-3xl text-textMain/20 italic">No feedback for this rating yet...</p>
                <button onClick={() => setFilterRating('all')} className="mt-6 text-primary font-sans font-bold text-xs uppercase tracking-widest hover:underline">Show all reviews</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-40">
            <Footer onLinkClick={onClose} />
          </div>
        </div>
      </div>

      {/* Floating Close Button for mobile */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-[1000] flex gap-3">
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-textMain text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Kembali
        </button>
      </div>
    </motion.div>
  );
};

export default FullTestimonialOverlay;