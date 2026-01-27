// C:\codingVibes\myPortfolio\mbell\mbell\src\components\FullGalleryOverlay.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Navbar from './Navbar';
import Footer from './Footer';
import type { PortfolioItem, Category } from '../types';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';

interface FullGalleryOverlayProps {
  items: PortfolioItem[];
  category: string; // This is now treated as the INITIAL category key (e.g. 'akad')
  onClose: () => void;
  onItemClick: (item: PortfolioItem) => void;
}

const FullGalleryOverlay: React.FC<FullGalleryOverlayProps> = ({ items, category: initialCategory, onClose, onItemClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [displayCount, setDisplayCount] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };

  }, []);

  console.log(
      items.map(i => i.category),
      'ACTIVE:',
      activeCategory
    );

  // Filter Logic: Filter all items based on activeCategory
  const normalize = (val: string) =>
    val
      .toLowerCase()
      .replace(/[\s_-]/g, '');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      normalize(item.category) === normalize(activeCategory)
    );
  }, [items, activeCategory]);


  const visibleItems = useMemo(() => filteredItems.slice(0, displayCount), [filteredItems, displayCount]);
  const hasMore = filteredItems.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setDisplayCount(10); // Reset count
    setIsFilterOpen(false); // Close menu
    // Scroll to top of grid
    if(scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentCategoryLabel = CATEGORY_LABELS[activeCategory as Category] || activeCategory;

  return (
     <motion.div
        initial={{ opacity: 0, y: "20%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-[9000] bg-surface flex flex-col"
     >
       {/* 
         Navbar Container
       */}
       <div className="absolute top-0 left-0 right-0 z-[50]">
          <Navbar isOverlay={true} onLinkClick={onClose} />
       </div>

       {/* 
         Scrollable Content Container
       */}
       <div 
         className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth"
         ref={scrollRef}
       >
          <div className="min-h-full flex flex-col">
            
            {/* Main Content Wrapper */}
            <div className="flex-1 pt-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
               
               {/* Header */}
               <div className="mb-12 text-center">
                 <span className="text-primary font-sans font-bold tracking-widest uppercase text-xs block mb-3">
                   Portfolio Collection
                 </span>
                 <motion.h2 
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-5xl text-textMain mb-4"
                 >
                   {currentCategoryLabel}
                 </motion.h2>
                 <div className="h-0.5 w-20 bg-primary/30 mx-auto mb-4"></div>
                 <p className="text-textMain/60 font-sans">
                   Displaying {visibleItems.length} of {filteredItems.length} moments
                 </p>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16 min-h-[50vh]">
                  <AnimatePresence mode="popLayout">
                    {visibleItems.map((item,) => (
                        <motion.div 
                        key={`${item.id}-grid`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onItemClick(item)}
                        className="cursor-pointer group relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-50"
                        >
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white font-serif text-lg md:text-xl truncate leading-tight">{item.title}</p>
                            <div className="h-0.5 w-8 bg-primary mt-2"></div>
                        </div>
                        </motion.div>
                    ))}
                  </AnimatePresence>
               </div>

               {/* Load More Button */}
               {hasMore && (
                  <div className="flex justify-center mb-24">
                     <Button onClick={handleLoadMore} variant="outline" className="px-12 py-4 border-textMain/20 text-textMain/80 hover:border-primary hover:text-white bg-white/50 backdrop-blur-sm">
                        Load More Photos
                     </Button>
                  </div>
               )}
               
               {!hasMore && <div className="mb-24"></div>}
            </div>

            {/* Footer */}
            <div className="relative z-10 bg-white">
              <Footer onLinkClick={onClose} />
            </div>
          </div>
       </div>

       {/* 
          BUBBLE NAVIGATION (FILTER)
          Fixed to viewport bottom-right
       */}
       <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
          {/* Overlay mask for menu when open (optional, strictly speaking not requested but good UX) */}
          
          {/* Menu Items (Bubbles) */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                className="flex flex-col items-end gap-3 mb-2 pointer-events-auto max-h-[60vh] overflow-y-auto pr-2 pb-2 no-scrollbar"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: (CATEGORIES.length - 1 - i) * 0.03 }}
                    className={`
                      px-5 py-2 rounded-full shadow-lg backdrop-blur-md border transition-all
                      text-sm font-sans tracking-wide whitespace-nowrap
                      ${activeCategory === cat 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white/90 text-textMain border-white hover:bg-white hover:text-primary'
                      }
                    `}
                  >
                    {CATEGORY_LABELS[cat]}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center pointer-events-auto relative z-20 group"
          >
             <AnimatePresence mode="wait">
               {!isFilterOpen ? (
                 <motion.div 
                    key="filter-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                 </motion.div>
               ) : (
                 <motion.div 
                    key="close-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </motion.div>
               )}
             </AnimatePresence>
             
             {/* Tooltip */}
             <span className="absolute right-full mr-3 bg-white/90 text-textMain text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                Filter Category
             </span>
          </motion.button>
       </div>
       
     </motion.div>
  );
}

export default FullGalleryOverlay;
