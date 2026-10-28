import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_LABELS, SHOW_PORTFOLIO_PHOTOS } from '../constants';
import type { Category, PortfolioItem } from '../types';
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
        
        if (!fetchError && data) {
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

  return (
    <section id="portfolio" ref={containerRef} className="py-20 md:py-28 relative z-10 overflow-hidden bg-mbell-canvas border-b border-mbell-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-12">
        <div className="max-w-2xl text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mbell-surface border border-mbell-border mb-3">
            <span className="text-xs font-sans font-medium text-mbell-primary">
              Karya Pilihan
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight">
            Galeri riasan & transformasi.
          </h2>
          <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
            Setiap wajah memiliki keunikan tersendiri. Kami memadukan warna, teknik kontur, dan kelembutan tekstur untuk menonjolkan kecantikanmu di setiap sudut foto.
          </p>
        </div>

        {/* Filter Pills (Scrollable di Mobile) */}
        {SHOW_PORTFOLIO_PHOTOS && (
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap min-h-[40px] px-5 py-2 rounded-full text-xs font-sans font-medium transition-colors border ${
                    isActive
                      ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary shadow-sm'
                      : 'bg-mbell-surface text-mbell-ink border-mbell-border hover:bg-mbell-blush/50'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Konten Portofolio */}
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-mbell-rose border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !SHOW_PORTFOLIO_PHOTOS ? (
        /* Bespoke Editorial Coming Soon Card */
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 text-center bg-mbell-surface/70 rounded-3xl border border-mbell-border shadow-[0_10px_30px_rgba(42,33,33,0.03)]"
          >
            <div className="w-16 h-16 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center mx-auto mb-5 text-mbell-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-mbell-ink mb-3">
              Galeri Portofolio Sedang Diperbarui
            </h3>
            
            <p className="font-sans text-sm text-mbell-muted max-w-md mx-auto mb-8 leading-relaxed">
              Kami sedang mengkurasi dokumentasi hasil riasan pernikahan, akad, dan wisuda terbaru. Ingin melihat foto riasan spesifik atau ingin konsultasi look?
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/6288293473765?text=Halo%20MBell%20MakeUp%2C%20saya%20tertarik%20melihat%20koleksi%20foto%20portofolio%20riasan%20terbaru."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-xs sm:text-sm hover:bg-mbell-ink transition-colors shadow-sm"
              >
                Tanya Foto Portofolio via WhatsApp
              </a>
              <a
                href="https://www.instagram.com/mbell.makeup/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 rounded-full bg-mbell-canvas text-mbell-ink border border-mbell-border font-sans font-medium text-xs sm:text-sm hover:bg-mbell-blush/60 transition-colors"
              >
                Lihat di Instagram @mbell.makeup
              </a>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {visibleItems.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-mbell-muted font-sans text-sm italic">
              Belum ada foto untuk kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map((item, i) => (
                <PortfolioCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onItemClick(item)} 
                  index={i} 
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-12">
            <button 
              type="button"
              onClick={() => onOpenGallery(portfolioData, activeCategory)} 
              className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-sans font-medium text-sm hover:bg-mbell-blush/60 transition-colors shadow-sm"
            >
              <span>Buka Seluruh Galeri ({portfolioData.length} Foto)</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const PortfolioCard = ({ item, onClick, index }: { item: PortfolioItem; onClick: () => void; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-mbell-surface border border-mbell-border shadow-sm transition-all duration-300 group-hover:shadow-md">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy" 
        />
        {/* Subtle Gradient & Typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-mbell-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
          <span className="text-[11px] font-sans font-medium text-mbell-rose uppercase tracking-wider mb-1">
            {item.category}
          </span>
          <h4 className="font-serif text-lg text-mbell-canvas font-medium">
            {item.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
