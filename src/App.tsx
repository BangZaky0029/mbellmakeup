
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import PriceList from './components/PriceList';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FlowerBackground from './components/ui/FlowerBackground';
import MusicPlayer from './components/ui/MusicPlayer';
import Button from './components/ui/Button';
import logo from './assets/logoBrand.png';

// Import Overlays and Types
import FullGalleryOverlay from './components/FullGalleryOverlay';
import Modal from './components/ui/Modal';
import type { PortfolioItem } from './types';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // State for Global Overlays (Gallery & Modal)
  const [galleryData, setGalleryData] = useState<{items: PortfolioItem[], category: string} | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Handlers
  const handleOpenGallery = (items: PortfolioItem[], category: string) => {
    setGalleryData({ items, category });
  };

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const handleCloseGallery = () => {
    setGalleryData(null);
  };

  const handleBookLook = (item: PortfolioItem) => {
    const phoneNumber = "6288293473765";
    // Format: "Halo MBELL Makeup, saya tertarik dengan look portfolio "akad_02" (akad). Boleh info lebih lanjut?"
    const text = `Halo MBELL Makeup, saya tertarik dengan look portfolio "${item.title}" (${item.category}). Boleh info lebih lanjut?`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="relative min-h-screen">
      {/* 
        WELCOME / SOUND ENABLE SCREEN 
        Ditampilkan jika user belum klik 'Enter Experience'
      */}
      <AnimatePresence>
        {!soundEnabled && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          >
             {/* Background Element khusus untuk Welcome Screen */}
             <div className="absolute inset-0 z-0 opacity-50">
                <FlowerBackground />
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="relative z-10 max-w-md w-full"
             >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/30 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <img src={logo} alt="Logo" className="w-20 h-25" />
                    </div>
                  </div>
                </div>

                <h1 className="font-serif text-4xl md:text-6xl text-textMain mb-3 tracking-wide">
                  MBell MakeUp
                </h1>
                
                <div className="h-[1px] w-24 bg-primary mx-auto mb-6"></div>

                <p className="font-sans text-textMain/60 text-sm md:text-base tracking-widest uppercase mb-10 leading-relaxed">
                  Enhancing Natural Beauty<br/>with a touch of elegance
                </p>

                <p className="font-sans text-xs text-textMain/40 mb-6 italic">
                  * For the best experience, please enable sound
                </p>

                <div className="flex justify-center">
                  <Button 
                    variant="primary" 
                    onClick={() => setSoundEnabled(true)}
                    className="shadow-xl"
                  >
                    Enter Experience
                  </Button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        MAIN CONTENT 
        Hanya dirender (atau setidaknya MusicPlayer aktif) setelah soundEnabled = true 
      */}
      {soundEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Abstract Background Layer */}
          <FlowerBackground />

          {/* Background Music - Will auto-play successfully because rendered after click */}
          <MusicPlayer />

          {/* Main Content Layer */}
          <Navbar />
          
          <main className="relative">
            <Hero />
            
            {/* Spacer for visual rhythm */}
            <div className="h-10 md:h-20"></div>
            
            <About />

            {/* Spacer */}
            <div className="h-10 md:h-20"></div>
            
            {/* Pass handlers to Portfolio */}
            <Portfolio 
              onOpenGallery={handleOpenGallery} 
              onItemClick={handleItemClick}
            />

            <div className="h-10 md:h-20"></div>
            
            <Testimonials />

            <div className="h-10 md:h-20"></div>

            <PriceList />

            <div className="h-10 md:h-20"></div>

            <Contact />
            
            {/* Spacer */}
            <div className="h-20"></div>
          </main>

          <Footer />

          {/* 
            GLOBAL OVERLAYS (Rendered at Root Level) 
            Ensures they cover everything and handle navigation correctly.
          */}
          <AnimatePresence>
            {galleryData && (
              <FullGalleryOverlay 
                items={galleryData.items} 
                category={galleryData.category}
                onClose={handleCloseGallery}
                onItemClick={handleItemClick}
              />
            )}
          </AnimatePresence>

          {/* Quick View Modal */}
          <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
            {selectedItem && (
              <div className="flex flex-col md:flex-row h-full w-full">
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

        </motion.div>
      )}
    </div>
  );
}

export default App;
