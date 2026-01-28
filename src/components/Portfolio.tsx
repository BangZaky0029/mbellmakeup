// C:\codingVibes\myPortfolio\mbell\mbell-1\src\components\Portfolio.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, animate, useScroll, useTransform } from 'framer-motion';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';
import type { Category, PortfolioItem } from '../types';
import Button from './ui/Button';
import { supabase } from '../lib/supabase';

const BATCH_SIZE = 6; 

interface PortfolioProps {
  onOpenGallery: (items: PortfolioItem[], category: string) => void;
  onItemClick: (item: PortfolioItem) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onOpenGallery, onItemClick }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('images')
          .select('*')
          .order('id', { ascending: true });
        
        if (!fetchError) {
          setPortfolioData(data as PortfolioItem[]);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredItems = useMemo(() => {
    return portfolioData.filter(
      item => item.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
    );
  }, [activeCategory, portfolioData]);

  const visibleItems = useMemo(() => filteredItems.slice(0, BATCH_SIZE), [filteredItems]);
  const firstRow = visibleItems.slice(0, Math.ceil(visibleItems.length / 2));
  const secondRow = visibleItems.slice(Math.ceil(visibleItems.length / 2));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const parallax1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]); 
  const parallax2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  if (loading) return (
    <section id="portfolio" className="py-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </section>
  );

  return (
    <section id="portfolio" ref={containerRef} className="py-24 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-sans font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
          >
            Curated Beauty
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl text-textMain mb-6"
          >
            Selected Works
          </motion.h2>
          <div className="h-[1px] w-16 bg-primary mx-auto mb-8 opacity-40"></div>
          <p className="text-textMain/60 font-sans text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Setiap wajah adalah kanvas, setiap riasan adalah karya seni. Jelajahi momen transformasi favorit kami.
          </p>
        </div>

        <div className="mb-16 flex justify-center flex-wrap gap-2 md:gap-3 max-w-5xl mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-300 font-sans border font-bold ${
                  activeCategory === cat 
                    ? 'bg-textMain border-textMain text-white shadow-lg' 
                    : 'bg-white/40 border-gray-100 text-textMain/60 hover:bg-white hover:border-primary hover:text-primary'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
        </div>
      </div>

      {/* MOODBOARD COLLAGE */}
      <div className="relative w-full perspective-container min-h-[50vh] flex flex-col items-center justify-center overflow-visible px-4">
        <div className="relative w-full max-w-[1600px] transform-style-3d rotate-x-[5deg] scale-[1.02] origin-center gpu-accelerated flex flex-col items-center">
          <InteractiveRow items={firstRow} onClick={onItemClick} parallaxX={parallax1} activeCategory={activeCategory} />
          <div className="h-6 md:h-12"></div>
          <InteractiveRow items={secondRow} onClick={onItemClick} parallaxX={parallax2} activeCategory={activeCategory} />
        </div>
      </div>

      <div className="flex justify-center mt-20 relative z-20">
        <Button onClick={() => onOpenGallery(portfolioData, activeCategory)} variant="outline" className="bg-white/80 shadow-sm border-textMain/10 text-textMain/80 px-12 py-4">
           Browse Full Experience
        </Button>
      </div>

      <style>{`
        .perspective-container { perspective: 2000px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
};

const InteractiveRow = ({ items, onClick, parallaxX, activeCategory }: any) => {
  const x = useMotionValue(0);
  
  useEffect(() => {
    animate(x, 0, { type: "spring", damping: 25, stiffness: 100 });
  }, [activeCategory, x]);

  if (items.length === 0) return (
    <div className="h-48 flex items-center justify-center italic text-textMain/20 font-serif text-2xl">
      Discovering beauty...
    </div>
  );

  return (
    <motion.div className="overflow-visible w-full flex justify-center items-center" style={{ x: parallaxX }}>
      <motion.div 
          drag="x"
          dragConstraints={{ left: -300, right: 300 }}
          style={{ x }}
          className="flex gap-4 md:gap-10 w-max px-[2vw] md:px-[5vw] cursor-grab active:cursor-grabbing justify-center items-center py-4"
      >
          {items.map((item: any) => (
            <MoodboardCard
              key={item.id}
              item={item}
              onClick={() => onClick(item)}
            />
          ))}

      </motion.div>
    </motion.div>
  );
}

const MoodboardCard = ({ item, onClick }: any) => {
  return (
    <motion.div
      whileHover={{ y: -20, scale: 1.03, transition: { duration: 0.4, ease: "easeOut" } }}
      className="group relative cursor-pointer gpu-accelerated flex-shrink-0"
      onClick={onClick}
    >
      {/* Container Card adjusted for better mobile spacing */}
      <div className="w-[160px] h-[230px] md:w-[360px] md:h-[500px] bg-white p-2.5 md:p-5 pb-16 md:pb-32 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 rounded-xl md:rounded-2xl transition-shadow duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(212,165,165,0.3)]">
        <div className="w-full h-full relative overflow-hidden bg-gray-100 rounded-lg md:rounded-xl">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-1000 group-hover:scale-110" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Footer Text area adjusted to prevent overflow on mobile */}
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-8 right-4 md:right-8">
          <h3 className="font-serif text-sm md:text-3xl font-medium text-textMain truncate leading-tight group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
          <div className="h-[1px] md:h-[2px] w-0 bg-primary/40 my-1 md:my-3 group-hover:w-12 transition-all duration-500"></div>
          <p className="font-sans text-[7px] md:text-[11px] text-textMain/40 font-bold uppercase tracking-[0.1em] md:tracking-[0.25em]">
            {item.category}
          </p>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none"></div>
    </motion.div>
  );
};

export default Portfolio;
