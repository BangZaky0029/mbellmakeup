import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';
import { CATEGORIES} from '../constants';
import type { Category } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import PORTFOLIO_ITEMS from "../data/portfolio.json";
import type { PortfolioItem } from '../types';

// Sound Assets (Paper ASMR)
const SOUNDS = {
  slide: "https://assets.mixkit.co/sfx/preview/mixkit-paper-slide-1530.mp3",
  open: "https://assets.mixkit.co/sfx/preview/mixkit-book-page-turn-1129.mp3",
  hover: "https://assets.mixkit.co/sfx/preview/mixkit-paper-dragging-1002.mp3"
};

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null)


  // Audio Refs
  const slideAudio = useRef<HTMLAudioElement | null>(null);
  const openAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    slideAudio.current = new Audio(SOUNDS.slide);
    openAudio.current = new Audio(SOUNDS.open);
    
    if(slideAudio.current) slideAudio.current.volume = 0.7;
    if(openAudio.current) openAudio.current.volume = 0.7;
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

  const filteredItems = activeCategory === 'All' 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === activeCategory);

  // Split items into two rows
  const firstRow = filteredItems.slice(0, Math.ceil(filteredItems.length / 2));
  const secondRow = filteredItems.slice(Math.ceil(filteredItems.length / 2));

  // --- PARALLAX SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const springConfig = { stiffness: 30, damping: 15, mass: 1 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Row 1 moves Left, Row 2 moves Right based on scroll
  const parallax1 = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]); 
  const parallax2 = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  const handleItemClick = (item: PortfolioItem) => {
    playSound('open');
    setSelectedItem(item);
  };

  // Pre-fill function for WhatsApp booking
  const handleBookLook = (item: PortfolioItem) => {
    const phoneNumber = "6288293473765";
    const text = `Halo MBELL Makeup, saya tertarik dengan look portfolio "${item.title}" (${item.category}). Boleh info lebih lanjut?`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
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
                {cat}
              </button>
            ))}
        </div>
      </div>

      {/* 
        MOODBOARD 3D AREA 
        Interactive draggable rows within a 3D perspective
      */}
      <div className="relative w-full perspective-container min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
        
        {/* Tilted Wrapper */}
        <div className="relative w-full transform-style-3d rotate-x-[20deg] rotate-z-[-5deg] md:rotate-x-[25deg] md:rotate-z-[-8deg] scale-90 md:scale-100 origin-center">
          
          {/* Row 1 */}
          <InteractiveRow 
            items={firstRow} 
            onClick={handleItemClick} 
            parallaxX={parallax1} 
            onInteraction={() => playSound('slide')} 
          />
          
          {/* Spacing between rows */}
          <div className="h-4 md:h-12"></div>

          {/* Row 2 */}
          <InteractiveRow 
            items={secondRow} 
            onClick={handleItemClick} 
            parallaxX={parallax2} 
            onInteraction={() => playSound('slide')} 
          />

        </div>
      </div>

      {/* Quick View Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="flex flex-col md:flex-row h-full w-full">
            {/* Modal Image */}
            <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-auto relative bg-gray-100 flex-shrink-0">
               <img 
                 src={selectedItem.imageUrl} 
                 alt={selectedItem.title} 
                 className="w-full h-full object-cover"
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-textMain tracking-widest uppercase shadow-sm">
                 {selectedItem.category}
               </div>
            </div>

            {/* Modal Details */}
            <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col justify-center">
              <h3 className="font-serif text-2xl md:text-4xl text-textMain mb-2">
                {selectedItem.title}
              </h3>
              <div className="w-16 h-1 bg-primary mb-4 md:mb-6"></div>
              
              <p className="font-sans text-base md:text-lg text-textMain/80 mb-4 md:mb-6 font-medium">
                {selectedItem.description}
              </p>
              
              <p className="font-sans text-sm md:text-base text-textMain/60 leading-relaxed mb-6 md:mb-8">
                {selectedItem.details || "Details for this project are coming soon."}
              </p>

              <div className="mt-auto">
                <Button variant="primary" onClick={() => handleBookLook(selectedItem)} className="w-full md:w-auto">
                  Book This Look
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .perspective-container {
          perspective: 1500px;
          overflow: visible; 
          touch-action: pan-y; /* CHANGED from none to pan-y to allow vertical scrolling */
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        /* Custom cursor classes for clarity */
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
}

const InteractiveRow: React.FC<InteractiveRowProps> = ({ items, onClick, parallaxX, onInteraction }) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragLimits, setDragLimits] = useState({ left: 0, right: 0 });

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
      setTimeout(updateLimits, 500); 

      return () => window.removeEventListener('resize', updateLimits);
    }
  }, [items]);

  const handleSlide = (slideDirection: 'prev' | 'next') => {
    onInteraction(); // Play sound
    const currentX = x.get();
    const slideAmount = 350; 
    let newX = slideDirection === 'next' ? currentX - slideAmount : currentX + slideAmount;

    // We assume boundaries, but for button slide we allow a bit of overflow then spring back if needed, 
    // or clamp strictly. Let's clamp strictly to avoid confusion.
    if (newX > dragLimits.right) newX = dragLimits.right;
    if (newX < dragLimits.left) newX = dragLimits.left;

    animate(x, newX, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative w-full group py-6 md:py-10">
       
       {/* Desktop Navigation Left */}
       <div className="hidden md:flex absolute left-[5%] top-1/2 -translate-y-1/2 z-30 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button 
           onClick={() => handleSlide('next')} // Left arrow moves content right (showing previous items)
           className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-textMain hover:bg-primary hover:text-white transition-all transform hover:scale-110"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
         </button>
       </div>

       {/* 
          WRAPPER FOR SCROLL PARALLAX 
          This outer motion.div handles the auto-scroll movement (Parallax) 
       */}
       <motion.div 
         className="overflow-visible w-full"
         style={{ x: parallaxX }} // Bind scroll progress here
       >
         {/* 
            INNER WRAPPER FOR DRAG
            This inner motion.div handles the manual swipe interactions
            Added cursor-grab and active:cursor-grabbing for hand gesture
            ADDED touch-pan-y to explicit allow vertical scroll
         */}
         <motion.div 
            ref={containerRef}
            drag="x"
            dragConstraints={dragLimits}
            dragElastic={0.1}
            onDragStart={() => onInteraction()} // Play sound on drag start
            style={{ x }}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-4 md:gap-8 w-max px-[5vw] md:px-[20vw] cursor-grab active:cursor-grabbing touch-pan-y"
         >
            {items.map((item, index) => (
               <MoodboardCard key={item.id} item={item} index={index} onClick={() => onClick(item)} />
            ))}
            {items.length < 5 && items.map((item, index) => (
               <MoodboardCard key={`dup-${item.id}`} item={item} index={index} onClick={() => onClick(item)} />
            ))}
         </motion.div>
       </motion.div>

       {/* Desktop Navigation Right */}
       <div className="hidden md:flex absolute right-[5%] top-1/2 -translate-y-1/2 z-30 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button 
           onClick={() => handleSlide('prev')} // Right arrow moves content left (showing next items)
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
        w-[200px] h-[260px] md:w-[320px] md:h-[420px]
        bg-white p-2 md:p-4 pb-8 md:pb-14
        shadow-[0_10px_20px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.05)]
        group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(212,165,165,0.3)]
        transition-shadow duration-500 ease-out
      ">
        <div className="w-full h-full relative overflow-hidden bg-gray-100">
           <img 
             src={item.imageUrl} 
             alt={item.title} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.9] group-hover:saturate-100 select-none pointer-events-none"
             loading="lazy"
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
        </div>
        <div className="absolute bottom-2 left-3 md:bottom-4 md:left-5 text-left">
           <h3 className="font-serif text-lg md:text-xl text-textMain/90 truncate max-w-[180px] md:max-w-[280px]">{item.title}</h3>
           <p className="font-sans text-[10px] md:text-xs text-textMain/50 tracking-widest uppercase">{item.category}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;