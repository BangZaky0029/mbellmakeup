// C:\codingVibes\myPortfolio\mbell\mbell-1\src\components\Portfolio.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_LABELS, SHOW_PORTFOLIO_PHOTOS } from '../constants';
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

        {SHOW_PORTFOLIO_PHOTOS && (
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
        )}
      </div>

      {/* MOODBOARD COLLAGE OR CLIENT-FACING COMING SOON NOTICE */}
      {!SHOW_PORTFOLIO_PHOTOS ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-8 py-16 text-center bg-white/60 backdrop-blur-xl rounded-[3rem] border border-dashed border-primary/20 shadow-xl relative z-20"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h3 className="font-serif text-3xl md:text-4xl text-textMain mb-3">
            New Portfolio Coming Soon ✨
          </h3>
          <p className="font-sans text-xs md:text-sm text-textMain/70 italic leading-relaxed max-w-lg mx-auto mb-6">
            Kami sedang memperbarui galeri dengan karya-karya riasan terbaru yang memukau. Tertarik melihat katalog lengkap atau ingin berkonsultasi mengenai inspirasi look Anda?
          </p>
          <div className="flex justify-center">
            <a
              href="https://wa.me/6288293473765?text=Halo%20MBELL%20Makeup%2C%20saya%20tertarik%20melihat%20katalog%20portfolio%20terbaru."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:bg-secondary transition-all transform hover:scale-105"
            >
              <span>Tanya Katalog via WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-20">
           {visibleItems.length === 0 ? (
             <div className="h-48 flex items-center justify-center italic text-textMain/20 font-serif text-2xl">
               Discovering beauty...
             </div>
           ) : (
             <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
               {visibleItems.map((item, i) => (
                  <div key={item.id} className="break-inside-avoid">
                    <MoodboardCard item={item} onClick={() => onItemClick(item)} index={i} />
                  </div>
               ))}
             </div>
           )}
        </div>
      )}

      {SHOW_PORTFOLIO_PHOTOS && (
        <div className="flex justify-center mt-20 relative z-20">
          <Button onClick={() => onOpenGallery(portfolioData, activeCategory)} variant="outline" className="bg-white/80 backdrop-blur shadow-sm border-white/50 text-textMain/80 px-12 py-4 hover:border-primary/50">
             Browse Full Experience
          </Button>
        </div>
      )}
    </section>
  );
};

const MoodboardCard = ({ item, onClick, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="group relative cursor-pointer w-full"
      onClick={onClick}
    >
      <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(212,165,165,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
          loading="lazy" 
        />
        {/* Editorial Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <p className="font-sans text-[9px] md:text-[10px] text-primary font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {item.category}
            </p>
            <h3 className="font-serif text-xl md:text-3xl text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
              {item.title}
            </h3>
            <div className="h-[1px] w-0 bg-primary/60 mt-4 group-hover:w-16 transition-all duration-700 delay-200"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
