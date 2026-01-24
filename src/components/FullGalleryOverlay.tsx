
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Navbar from './Navbar';
import Footer from './Footer';
import type { PortfolioItem } from '../types';

interface FullGalleryOverlayProps {
  items: PortfolioItem[];
  category: string;
  onClose: () => void;
  onItemClick: (item: PortfolioItem) => void;
}

const FullGalleryOverlay: React.FC<FullGalleryOverlayProps> = ({ items, category, onClose, onItemClick }) => {
  const [displayCount, setDisplayCount] = useState(12);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const visibleItems = useMemo(() => items.slice(0, displayCount), [items, displayCount]);
  const hasMore = items.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

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
         Since this motion.div has a transform, 'fixed' children behave like 'absolute' relative to this container.
         This keeps the navbar pinned to the top of the overlay visually.
       */}
       <div className="absolute top-0 left-0 right-0 z-[50]">
          <Navbar isOverlay={true} onLinkClick={onClose} />
       </div>

       {/* 
         Scrollable Content Container
         Occupies full height. Padding top ensures content starts below the Navbar.
       */}
       <div 
         className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth"
         ref={scrollRef}
       >
          <div className="min-h-full flex flex-col">
            
            {/* Main Content Wrapper - Pushes Footer down */}
            <div className="flex-1 pt-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
               
               {/* Header */}
               <div className="mb-12 text-center">
                 <span className="text-primary font-sans font-bold tracking-widest uppercase text-xs block mb-3">
                   Portfolio Collection
                 </span>
                 <h2 className="font-serif text-4xl md:text-5xl text-textMain mb-4">
                   {category}
                 </h2>
                 <div className="h-0.5 w-20 bg-primary/30 mx-auto mb-4"></div>
                 <p className="text-textMain/60 font-sans">
                   Displaying {visibleItems.length} of {items.length} captured moments
                 </p>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16">
                  {visibleItems.map((item, index) => (
                     <motion.div 
                       key={`${item.id}-grid-${index}`}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.4, delay: index * 0.05 }}
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
                       
                       {/* Category Badge */}
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full z-10 opacity-100 shadow-sm border border-white/50">
                          <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-textMain">
                            {item.category}
                          </span>
                       </div>
                       
                       {/* Text Content */}
                       <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white font-serif text-lg md:text-xl truncate leading-tight">{item.title}</p>
                          <div className="h-0.5 w-8 bg-primary mt-2"></div>
                       </div>
                     </motion.div>
                  ))}
               </div>

               {/* Load More Button - Added significant bottom margin to separate from footer */}
               {hasMore && (
                  <div className="flex justify-center mb-24">
                     <Button onClick={handleLoadMore} variant="outline" className="px-12 py-4 border-textMain/20 text-textMain/80 hover:border-primary hover:text-white bg-white/50 backdrop-blur-sm">
                        Load More Photos
                     </Button>
                  </div>
               )}
               
               {/* Spacer if no button, ensuring footer doesn't stick too close to last grid items */}
               {!hasMore && <div className="mb-24"></div>}
            </div>

            {/* Footer - Naturally flows at the bottom */}
            <div className="relative z-10 bg-white">
              <Footer onLinkClick={onClose} />
            </div>
          </div>
       </div>
       
     </motion.div>
  );
}

export default FullGalleryOverlay;
