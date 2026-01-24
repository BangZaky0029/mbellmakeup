
// C:\codingVibes\myPortfolio\mbell\mbell\src\components\Portfolio.tsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, animate, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';
import type { Category, PortfolioItem } from '../types';
import Button from './ui/Button';
import PORTFOLIO_ITEMS from '../data/portfolio.json';

// Sound Assets
const SOUNDS = {
  slide: "https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3",
  open: "https://assets.mixkit.co/sfx/preview/mixkit-book-page-turn-1129.mp3",
  hover: "https://assets.mixkit.co/sfx/preview/mixkit-paper-dragging-1002.mp3"
};

const BATCH_SIZE = 20;

interface PortfolioProps {
  onOpenGallery: (items: PortfolioItem[], category: string) => void;
  onItemClick: (item: PortfolioItem) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onOpenGallery, onItemClick }) => {
  // Use imported data directly
  const portfolioData: PortfolioItem[] = PORTFOLIO_ITEMS as unknown as PortfolioItem[];
  
  // Set initial category
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio Refs
  const slideAudio = useRef<HTMLAudioElement | null>(null);
  const openAudio = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    slideAudio.current = new Audio(SOUNDS.slide);
    openAudio.current = new Audio(SOUNDS.open);
    
    if(slideAudio.current) slideAudio.current.volume = 0.5;
    if(openAudio.current) openAudio.current.volume = 0.5;
  }, []);

  const playSound = (type: 'slide' | 'open') => {
    try {
      if (type === 'slide' && slideAudio.current) {
        slideAudio.current.currentTime = 0;
        slideAudio.current.play().catch(() => {});
      } else if (type === 'open' && openAudio.current) {
        openAudio.current.currentTime = 0;
        openAudio.current.play().catch(() => {});
      }
    } catch (e) {
      console.warn("Audio play blocked", e);
    }
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    return portfolioData.filter(item => item.category === activeCategory);
  }, [activeCategory, portfolioData]);

  // Main View: Only show first batch (e.g. 20) in the 3D view for performance
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, BATCH_SIZE);
  }, [filteredItems]);

  const firstRow = visibleItems.slice(0, Math.ceil(visibleItems.length / 2));
  const secondRow = visibleItems.slice(Math.ceil(visibleItems.length / 2));

  // --- PARALLAX SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const springConfig = { stiffness: 30, damping: 15, mass: 1 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const parallax1 = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]); 
  const parallax2 = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  const handleItemClick = (item: PortfolioItem) => {
    playSound('open');
    onItemClick(item);
  };

  const handleOpenGallery = () => {
    playSound('slide');
    // Change: Pass ALL portfolioData instead of filteredItems to show the full collection
    onOpenGallery(portfolioData, "All Moments Collection");
  };

  return (
    <section id="portfolio" ref={containerRef} className="py-24 relative z-10 overflow-hidden min-h-screen flex flex-col justify-center bg-transparent">
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-textMain mb-4"
          >
            Selected Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-textMain/60 font-sans tracking-wide"
          >
            A curated collection of moments and beauty.
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8 flex justify-center flex-wrap gap-2 md:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300
                  font-sans tracking-wide border backdrop-blur-sm
                  ${activeCategory === cat 
                    ? 'bg-textMain border-textMain text-white shadow-lg transform -translate-y-1' 
                    : 'bg-white/50 border-gray-200 text-textMain/70 hover:border-primary hover:text-primary hover:shadow-sm'
                  }
                `}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
        </div>
      </div>

      {/* 
        MOODBOARD 3D AREA 
      */}
      <div className="relative w-full perspective-container min-h-[50vh] flex items-center justify-center">
        
        <div className="relative w-full transform-style-3d rotate-x-[20deg] rotate-z-[-5deg] md:rotate-x-[25deg] md:rotate-z-[-8deg] scale-90 md:scale-100 origin-center">
          
          {/* Row 1 */}
          <InteractiveRow 
            items={firstRow} 
            onClick={handleItemClick} 
            parallaxX={parallax1} 
            onInteraction={() => playSound('slide')} 
            activeCategory={activeCategory}
          />
          
          {/* Spacing between rows */}
          <div className="h-4 md:h-12"></div>

          {/* Row 2 */}
          <InteractiveRow 
            items={secondRow} 
            onClick={handleItemClick} 
            parallaxX={parallax2} 
            onInteraction={() => playSound('slide')} 
            activeCategory={activeCategory}
          />

        </div>
      </div>

      {/* Load More / View All Button - Always visible at bottom */}
      <div className="flex justify-center mt-12 relative z-20">
        <Button onClick={handleOpenGallery} variant="outline" className="bg-white/80 backdrop-blur-md">
           Browse Full Gallery
        </Button>
      </div>

      <style>{`
        .perspective-container {
          perspective: 1500px;
          overflow: visible; 
          touch-action: pan-y;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .cursor-grab {
          cursor: grab;
        }
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </section>
  );
};

// --- INTERACTIVE ROW COMPONENT ---
interface InteractiveRowProps {
  items: PortfolioItem[];
  onClick: (item: PortfolioItem) => void;
  parallaxX: MotionValue<string>;
  onInteraction: () => void;
  activeCategory: string;
}

const InteractiveRow: React.FC<InteractiveRowProps> = ({ items, onClick, parallaxX, onInteraction, activeCategory }) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragLimits, setDragLimits] = useState({ left: 0, right: 0 });

  useEffect(() => {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
  }, [activeCategory, x]);

  // Recalculate drag limits when items change
  useEffect(() => {
    if (containerRef.current) {
      const updateLimits = () => {
        const contentWidth = containerRef.current?.scrollWidth || 0;
        const viewportWidth = window.innerWidth;
        const padding = viewportWidth * 0.2; 
        const maxScroll = -(contentWidth - viewportWidth + (padding * 2));
        setDragLimits({ left: Math.min(maxScroll, 0), right: 0 });
      };

      updateLimits();
      window.addEventListener('resize', updateLimits);
      const timeout = setTimeout(updateLimits, 500); 

      return () => {
        window.removeEventListener('resize', updateLimits);
        clearTimeout(timeout);
      };
    }
  }, [items]);

  const handleSlide = (slideDirection: 'prev' | 'next') => {
    onInteraction();
    const currentX = x.get();
    const slideAmount = 350; 
    let newX = slideDirection === 'next' ? currentX - slideAmount : currentX + slideAmount;

    if (newX > dragLimits.right) newX = dragLimits.right;
    if (newX < dragLimits.left) newX = dragLimits.left;

    animate(x, newX, { type: "spring", stiffness: 300, damping: 30 });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative w-full group py-6 md:py-10">
      
      {/* Desktop Navigation Left */}
      <div className="hidden md:flex absolute left-[5%] top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => handleSlide('prev')}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <motion.div 
        className="overflow-visible w-full"
        style={{ x: parallaxX }}
      >
        <motion.div 
            ref={containerRef}
            drag="x"
            dragConstraints={dragLimits}
            dragElastic={0.1}
            onDragStart={() => onInteraction()}
            style={{ x }}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-4 md:gap-8 w-max px-[5vw] md:px-[20vw] cursor-grab active:cursor-grabbing touch-pan-y"
        >
            {items.map((item, index) => (
              <MoodboardCard key={`${item.id}-${index}`} item={item} index={index} onClick={() => onClick(item)} />
            ))}
        </motion.div>
      </motion.div>

      {/* Desktop Navigation Right */}
      <div className="hidden md:flex absolute right-[5%] top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => handleSlide('next')}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}

const MoodboardCard = ({ item, index, onClick }: { item: PortfolioItem, index: number, onClick: () => void }) => {
  const rotation = index % 2 === 0 ? 2 : -2; 
  const yOffset = index % 3 === 0 ? -10 : 10;
  
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotate: 0, 
        y: -15,
        zIndex: 50,
        transition: { type: "spring", stiffness: 300 }
      }}
      initial={{ rotate: rotation, y: yOffset }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="
        w-[230px] h-[320px] md:w-[320px] md:h-[440px]
        bg-white p-3 md:p-5 pb-20 md:pb-24
        shadow-[0_10px_20px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.05)]
        group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(212,165,165,0.3)]
        transition-shadow duration-500 ease-out
      ">
        <div className="w-full h-full relative overflow-hidden bg-gray-50 border border-gray-100">
          {/* Skeleton Loader */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
          )}
          
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className={`
              w-full h-full object-cover transition-all duration-700 
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              group-hover:scale-110 saturate-[0.95] group-hover:saturate-100 select-none pointer-events-none
            `}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
        </div>
        
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-left w-[calc(100%-2rem)]">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-textMain truncate leading-tight mb-2">
            {item.title}
          </h3>
          
          <div className="flex items-center gap-3">
             <span className="w-6 h-[1px] bg-primary/80"></span>
             <p className="font-sans text-xs md:text-sm text-textMain/70 font-bold tracking-widest uppercase truncate">
               {item.category}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
