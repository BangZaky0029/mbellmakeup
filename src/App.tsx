import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import PriceList from './components/PriceList';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FlowerBackground from './components/ui/FlowerBackground';
import MusicPlayer from './components/ui/MusicPlayer';
import ScrollProgress from './components/ui/ScrollProgress';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollReveal from './components/ui/ScrollReveal';
import Button from './components/ui/Button';
import InvitationsShowcase from './components/InvitationsShowcase';
import logo from './assets/logoBrand.png';
import SiteGuard from './components/SiteGuard';
import PetalRain from './components/ui/PetalRain';
import SmoothScroll from './components/ui/SmoothScroll';

// Import Overlays and Types
import FullGalleryOverlay from './components/FullGalleryOverlay';
import FullTestimonialOverlay from './components/FullTestimonialOverlay';
import Modal from './components/ui/Modal';
import type { PortfolioItem } from './types';

function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // State for Global Overlays
  const [galleryData, setGalleryData] = useState<{ items: PortfolioItem[]; category: string } | null>(null);
  const [isTestimonialGalleryOpen, setIsTestimonialGalleryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Handlers
  const handleOpenGallery = (items: PortfolioItem[], category: string) => {
    setGalleryData({ items, category });
  };

  const handleOpenTestimonials = () => {
    setIsTestimonialGalleryOpen(true);
  };

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const handleCloseGallery = () => {
    setGalleryData(null);
  };

  const handleBookLook = (item: PortfolioItem) => {
    const phoneNumber = "6288293473765";
    const text = `Halo MBell MakeUp, saya tertarik dengan look portfolio "${item.title}" (${item.category}). Boleh info ketersediaan slot tanggal untuk look ini?`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <SiteGuard>
      <div className="relative min-h-screen bg-mbell-canvas text-mbell-ink font-sans selection:bg-mbell-primary selection:text-mbell-canvas">
        {/* Soft Organic Flower Petal Rain across entire app */}
        <PetalRain />

        <AnimatePresence>
          {!soundEnabled && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
              className="fixed inset-0 z-[100] bg-mbell-canvas flex flex-col items-center justify-center text-center px-6 overflow-hidden"
            >
              <div className="absolute inset-0 z-0 opacity-40">
                <FlowerBackground />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="relative z-10 max-w-md w-full"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-mbell-surface border border-mbell-border flex items-center justify-center p-3 shadow-[0_8px_24px_rgba(200,138,130,0.2)]">
                    <img src={logo} alt="MBell MakeUp" className="w-full h-full object-contain" />
                  </div>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl text-mbell-ink mb-3 font-medium tracking-tight">
                  MBell MakeUp
                </h1>
                
                <div className="h-[1px] w-16 bg-mbell-rose mx-auto mb-4"></div>

                <p className="font-sans text-mbell-muted text-xs sm:text-sm tracking-widest uppercase mb-8 leading-relaxed">
                  Enhancing Natural Beauty<br />with a touch of elegance
                </p>

                <p className="font-sans text-xs text-mbell-muted/70 mb-6 italic">
                  * Untuk pengalaman terbaik, silakan aktifkan audio
                </p>

                <div className="flex justify-center">
                  <Button 
                    variant="primary" 
                    onClick={() => setSoundEnabled(true)}
                    className="shadow-lg min-w-[200px]"
                  >
                    Buka Halaman Riasan
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {soundEnabled && (
          <SmoothScroll>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
            {/* Ambient Background & Fixed Controls */}
            <FlowerBackground />
            <ScrollProgress />
            <MusicPlayer />
            <ScrollToTop />
            
            {/* Primary Fixed Floating Navigation */}
            <Navbar />
            
            <main className="relative z-10">
              <Hero />
              <ScrollReveal>
                <About />
              </ScrollReveal>
              <ScrollReveal>
                <Portfolio onOpenGallery={handleOpenGallery} onItemClick={handleItemClick} />
              </ScrollReveal>
              <ScrollReveal>
                <PriceList />
              </ScrollReveal>
              <ScrollReveal>
                <InvitationsShowcase />
              </ScrollReveal>
              <ScrollReveal>
                <Testimonials onSeeFullGallery={handleOpenTestimonials} />
              </ScrollReveal>
              <ScrollReveal>
                <Contact />
              </ScrollReveal>
            </main>

            <Footer />

            {/* Overlays */}
            <AnimatePresence>
              {galleryData && (
                <FullGalleryOverlay 
                  items={galleryData.items} 
                  category={galleryData.category}
                  onClose={handleCloseGallery}
                  onItemClick={handleItemClick}
                />
              )}

              {isTestimonialGalleryOpen && (
                <FullTestimonialOverlay 
                  onClose={() => setIsTestimonialGalleryOpen(false)} 
                />
              )}
            </AnimatePresence>

            {/* Selected Portfolio Item Modal */}
            <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
              {selectedItem && (
                <div className="flex flex-col md:flex-row h-full w-full bg-mbell-canvas">
                  <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-auto relative bg-mbell-surface flex-shrink-0">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4 bg-mbell-canvas/90 backdrop-blur px-3 py-1 rounded-full text-xs font-sans font-medium text-mbell-ink border border-mbell-border shadow-sm">
                      {selectedItem.category}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between text-left">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl font-medium text-mbell-ink mb-2">
                        {selectedItem.title}
                      </h3>
                      <div className="w-12 h-[2px] bg-mbell-rose mb-4"></div>
                      <p className="font-sans text-sm md:text-base text-mbell-muted mb-4 font-medium leading-relaxed">
                        {selectedItem.description}
                      </p>
                      <p className="font-sans text-xs md:text-sm text-mbell-muted/80 leading-relaxed mb-6">
                        {selectedItem.details || "Detail untuk proyek tata rias ini terkurasi khusus sesuai karakter klien."}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-mbell-border">
                      <Button 
                        variant="primary" 
                        onClick={() => handleBookLook(selectedItem)} 
                        className="w-full"
                      >
                        Pesan Look Riasan Ini
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Modal>
          </motion.div>
        </SmoothScroll>
        )}
      </div>
    </SiteGuard>
  );
}

export default App;
