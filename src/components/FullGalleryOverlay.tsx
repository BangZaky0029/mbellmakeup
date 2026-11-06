import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import type { PortfolioItem, Category } from '../types';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';
import Masonry, { type MasonryItem } from './ui/Masonry';

interface FullGalleryOverlayProps {
  items: PortfolioItem[];
  category: string; 
  onClose: () => void;
  onItemClick: (item: PortfolioItem) => void;
}

const normalize = (val: string) =>
  val.toLowerCase().replace(/[\s_-]/g, '');

const FullGalleryOverlay: React.FC<FullGalleryOverlayProps> = ({ 
  items, 
  category: initialCategory, 
  onClose, 
  onItemClick 
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Responsive column tracker: 4 columns on desktop, 3 on tablet, 2 on mobile
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columnCount = windowWidth < 640 ? 2 : windowWidth < 1024 ? 3 : 4;

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!activeCategory || activeCategory === 'all') {
      return items;
    }
    const normTarget = normalize(activeCategory);
    return items.filter(item =>
      normalize(item.category || '') === normTarget
    );
  }, [items, activeCategory]);

  // Compute category options with photo counts
  const categoryOptions = useMemo(() => {
    const countMap = new Map<string, number>();
    items.forEach(item => {
      const norm = normalize(item.category || '');
      countMap.set(norm, (countMap.get(norm) || 0) + 1);
    });

    const list: { key: string; label: string; count: number }[] = [
      { key: 'all', label: 'Semua Look', count: items.length }
    ];

    CATEGORIES.forEach(cat => {
      const norm = normalize(cat);
      list.push({
        key: cat,
        label: CATEGORY_LABELS[cat] || cat,
        count: countMap.get(norm) || 0
      });
    });

    return list;
  }, [items]);

  // Convert to MasonryItem format with varied portrait heights for authentic Masonry look
  const masonryItems: MasonryItem[] = useMemo(() => {
    const heights = [760, 620, 840, 700, 920, 650, 780, 860];
    
    return filteredItems.map((item, idx) => {
      const height = heights[idx % heights.length];
      const catLabel = CATEGORY_LABELS[item.category as Category] || item.category;
      const waText = encodeURIComponent(
        `Halo MBell MakeUp, saya tertarik dengan look portfolio "${item.title}" (${catLabel}). Boleh info ketersediaan slot tanggal untuk look ini?`
      );
      
      return {
        id: String(item.id || idx),
        img: item.imageUrl,
        width: 600,
        height,
        title: item.title,
        description: catLabel,
        alt: item.title,
        url: `https://wa.me/6288293473765?text=${waText}`,
        rawItem: item
      };
    });
  }, [filteredItems]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setIsFilterOpen(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentCategoryLabel = useMemo(() => {
    if (activeCategory === 'all') return 'Semua Koleksi Look';
    return CATEGORY_LABELS[activeCategory as Category] || activeCategory;
  }, [activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 120 }}
      className="fixed inset-0 z-[9000] bg-[#FCF9F6] flex flex-col"
    >
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 z-[150]">
        <Navbar isOverlay={true} onLinkClick={onClose} />
      </div>

      {/* Main Scrollable Canvas */}
      <div 
        className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth pt-28 pb-16"
        ref={scrollRef}
      >
        <div className="min-h-full flex flex-col items-center">
          
          <div className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 mb-16">
            
            {/* Header Section */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mbell-rose/30 text-mbell-primary font-sans font-semibold tracking-widest uppercase text-[10px] mb-4 bg-mbell-surface/70 shadow-sm"
              >
                <span>Gallery Collection</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mbell-rose" />
                <span>{filteredItems.length} Look Terkatalog</span>
              </motion.div>

              <motion.h2 
                key={activeCategory}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.3 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl text-mbell-ink mb-4 font-medium tracking-tight"
              >
                {currentCategoryLabel}
              </motion.h2>

              <p className="text-mbell-muted font-sans text-sm sm:text-base tracking-wide max-w-lg mx-auto leading-relaxed">
                Koleksi lengkap dokumentasi tata rias pengantin, wisuda, dan editorial dari arsip MBell MakeUp.
              </p>

              {/* Horizontal Category Pill Tabs (Quick Access) */}
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-2 max-w-full">
                  {categoryOptions.map((opt) => {
                    const isActive = activeCategory === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleCategoryChange(opt.key)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-sans transition-all duration-200 border ${
                          isActive
                            ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary shadow-sm font-semibold scale-105'
                            : 'bg-mbell-surface/80 text-mbell-ink border-mbell-border/80 hover:bg-mbell-blush/60 font-medium'
                        }`}
                      >
                        {opt.label} {opt.count > 0 && <span className="opacity-75 text-[11px]">({opt.count})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4-COLUMN MASONRY GRID (As requested, matching Image 1) */}
            {filteredItems.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-2xl text-mbell-muted/60 italic">
                  Belum ada foto untuk kategori ini...
                </p>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="mt-4 px-6 py-2 rounded-full bg-mbell-primary text-white text-xs font-sans font-medium"
                >
                  Tampilkan Semua Look
                </button>
              </div>
            ) : (
              <div className="w-full relative mt-4">
                <Masonry
                  items={masonryItems}
                  columns={columnCount}
                  gap={14}
                  radius={16}
                  animateFrom="bottom"
                  hoverEffect="zoom"
                  captions="hover"
                  lightbox={true}
                  draggable={false}
                  stagger={0.03}
                  duration={0.55}
                  bounce={0.12}
                  revealOnScroll={true}
                  onItemClick={(item) => {
                    if (item.rawItem) {
                      onItemClick(item.rawItem);
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="relative z-10 bg-white w-full border-t border-mbell-border/60">
            <Footer onLinkClick={onClose} />
          </div>
        </div>
      </div>

      {/* FLOATING FILTER BUBBLE (Bottom-Right for Quick Mobile Toggling) */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              className="flex flex-col items-end gap-2 mb-2 pointer-events-auto max-h-[60vh] overflow-y-auto pr-2 pb-2 no-scrollbar"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
            >
              {categoryOptions.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  onClick={() => handleCategoryChange(opt.key)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`
                    px-5 py-2 rounded-full shadow-lg backdrop-blur-xl border transition-all
                    text-xs font-sans font-semibold tracking-wide
                    ${activeCategory === opt.key 
                      ? 'bg-mbell-primary text-white border-mbell-primary scale-105 shadow-mbell-primary/30' 
                      : 'bg-white/95 text-mbell-ink border-mbell-border hover:bg-mbell-surface'
                    }
                  `}
                >
                  {opt.label} {opt.count > 0 && <span className="opacity-75">({opt.count})</span>}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`
            w-14 h-14 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto relative z-20 
            transition-colors duration-300 border border-white/40
            ${isFilterOpen ? 'bg-mbell-ink text-white' : 'bg-mbell-primary text-white'}
          `}
          aria-label="Filter Kategori"
        >
          {isFilterOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FullGalleryOverlay;
