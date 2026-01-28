
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
  category: string; 
  onClose: () => void;
  onItemClick: (item: PortfolioItem) => void;
}

const FullGalleryOverlay: React.FC<FullGalleryOverlayProps> = ({ items, category: initialCategory, onClose, onItemClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [displayCount, setDisplayCount] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const normalize = (val: string) =>
    val.toLowerCase().replace(/[\s_-]/g, '');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      normalize(item.category) === normalize(activeCategory)
    );
  }, [items, activeCategory]);

  const visibleItems = useMemo(() => filteredItems.slice(0, displayCount), [filteredItems, displayCount]);
  const hasMore = filteredItems.length > displayCount;

  // Masonry logic
  const columns = useMemo(() => {
    const colCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 3;
    const result: PortfolioItem[][] = Array.from({ length: colCount }, () => []);
    visibleItems.forEach((item, index) => {
      result[index % colCount].push(item);
    });
    return result;
  }, [visibleItems]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setDisplayCount(12);
    setIsFilterOpen(false);
    if(scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentCategoryLabel = CATEGORY_LABELS[activeCategory as Category] || activeCategory;

  return (
     <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        className="fixed inset-0 z-[9000] bg-[#faf8f6] flex flex-col"
     >
       <div className="absolute top-0 left-0 right-0 z-[150]">
          <Navbar isOverlay={true} onLinkClick={onClose} />
       </div>

       <div 
         className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth"
         ref={scrollRef}
       >
          <div className="min-h-full flex flex-col items-center">
            
            <div className="flex-1 pt-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
               
               {/* Header Section */}
               <div className="mb-16 text-center">
                 <motion.div
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="inline-block px-4 py-1 rounded-full border border-primary/20 text-primary font-sans font-bold tracking-widest uppercase text-[10px] mb-4 bg-white/50"
                 >
                   Gallery Collection
                 </motion.div>
                 <motion.h2 
                    key={activeCategory}
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    className="font-serif text-5xl md:text-6xl text-textMain mb-6"
                 >
                   {currentCategoryLabel}
                 </motion.h2>
                 <p className="text-textMain/50 font-sans tracking-wide max-w-md mx-auto italic">
                   A curated collection of beauty from our archives.
                 </p>
               </div>

               {/* MASONRY COLLAGE LAYOUT */}
               <div className="flex gap-4 md:gap-8 mb-20 justify-center">
                 {columns.map((column, colIdx) => (
                   <div key={`col-${colIdx}`} className="flex flex-col gap-4 md:gap-8 flex-1 max-w-[400px]">
                     {column.map((item) => (
                       <motion.div
                         key={item.id}
                         layoutId={`item-${item.id}`}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         whileHover={{ y: -8 }}
                         onClick={() => onItemClick(item)}
                         className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm bg-white p-2"
                       >
                         <div className="aspect-auto overflow-hidden rounded-xl bg-gray-50">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                         <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                            <h4 className="text-white font-serif text-base leading-tight truncate">{item.title}</h4>
                            <p className="text-white/70 text-[9px] uppercase tracking-widest mt-1">Details</p>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 ))}
               </div>

               {/* Empty State */}
               {filteredItems.length === 0 && (
                 <div className="py-32 text-center">
                    <p className="font-serif text-2xl text-textMain/30 italic">No captures found yet...</p>
                 </div>
               )}

               {/* Load More Button */}
               {hasMore && (
                  <div className="flex justify-center mb-24">
                     <Button onClick={handleLoadMore} variant="outline" className="px-12 py-4 border-textMain/10 text-textMain/70 bg-white/80 hover:bg-white hover:text-primary transition-all shadow-sm">
                        Discover More Captures
                     </Button>
                  </div>
               )}
            </div>

            <div className="relative z-10 bg-white w-full border-t border-gray-100">
              <Footer onLinkClick={onClose} />
            </div>
          </div>
       </div>

       {/* FILTER BUBBLE NAVIGATION */}
       <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4 pointer-events-none">
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                className="flex flex-col items-end gap-3 mb-2 pointer-events-auto max-h-[60vh] overflow-y-auto pr-2 pb-2 no-scrollbar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`
                      px-6 py-2.5 rounded-full shadow-lg backdrop-blur-xl border transition-all
                      text-xs font-sans font-bold tracking-widest uppercase
                      ${activeCategory === cat 
                        ? 'bg-primary text-white border-primary scale-105' 
                        : 'bg-white/90 text-textMain border-white/50 hover:bg-white'
                      }
                    `}
                  >
                    {CATEGORY_LABELS[cat]}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-16 h-16 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto relative z-20 
              transition-colors duration-300
              ${isFilterOpen ? 'bg-textMain text-white' : 'bg-primary text-white'}
            `}
          >
             {isFilterOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
             )}
          </motion.button>
       </div>
     </motion.div>
  );
}

export default FullGalleryOverlay;
