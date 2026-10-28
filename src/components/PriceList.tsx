import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import price01 from '../assets/price_01.webp';
import price02 from '../assets/price_02.webp';
import price03 from '../assets/price_03.png';
import termsImg from '../assets/term-condition.jpeg';

interface PackageItem {
  id: string;
  label: string;
  shortTitle: string;
  image: string;
  desc: string;
  waQuery: string;
}

const PACKAGES: PackageItem[] = [
  {
    id: 'paket-1',
    label: 'Katalog Paket 1',
    shortTitle: 'Wedding & Akad',
    image: price01,
    desc: 'Paket riasan pengantin, prosesi akad nikah, resepsi, dan riasan pendamping keluarga.',
    waQuery: 'Halo MBell MakeUp, saya ingin konsultasi mengenai Paket 1 (Wedding & Akad). Boleh minta info detail ketersediaan tanggal dan layanannya?',
  },
  {
    id: 'paket-2',
    label: 'Katalog Paket 2',
    shortTitle: 'Wisuda & Lamaran',
    image: price02,
    desc: 'Pilihan riasan wisuda, sesi lamaran (engagement), pre-wedding, dan acara pesta spesial.',
    waQuery: 'Halo MBell MakeUp, saya tertarik dengan Paket 2 (Wisuda, Lamaran, & Pesta). Apakah ada slot kosong untuk tanggal acara saya?',
  },
  {
    id: 'paket-3',
    label: 'Katalog Paket 3',
    shortTitle: 'Layanan Tambahan',
    image: price03,
    desc: 'Riasan keluarga, bridesmaid, hijab do / hair do, dan paket rombongan acara.',
    waQuery: 'Halo MBell MakeUp, saya mau tanya rincian Paket 3 (Layanan Tambahan & Bridesmaid). Mohon info lengkapnya ya kak.',
  },
  {
    id: 'ketentuan',
    label: 'Syarat & Ketentuan',
    shortTitle: 'Ketentuan & DP',
    image: termsImg,
    desc: 'Panduan tata cara booking jadwal, ketentuan uang muka (DP), pelunasan, dan kebijakan layanan.',
    waQuery: 'Halo MBell MakeUp, saya sudah membaca Syarat & Ketentuan dan ingin melakukan booking jadwal makeup.',
  },
];

export const PriceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PackageItem>(PACKAGES[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  // Lock body scroll safely while zoom modal is open to prevent background repaint jerk
  useEffect(() => {
    let timeoutId: any;
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      timeoutId = setTimeout(() => {
        document.body.style.overflow = '';
      }, 260);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = '';
    };
  }, [isZoomed]);

  // Close zoom modal on Escape key
  useEffect(() => {
    if (!isZoomed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  const handleWhatsAppBooking = (item: PackageItem) => {
    const phoneNumber = '6288293473765';
    const encodedText = encodeURIComponent(item.waQuery);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  const handleScrollToBooking = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="pricelist" className="py-20 md:py-28 bg-mbell-surface/60 border-b border-mbell-border relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        
        {/* Header Seksi */}
        <div className="max-w-2xl text-left mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mbell-canvas border border-mbell-border mb-3">
            <span className="text-xs font-sans font-medium text-mbell-primary">
              Investasi & Paket Layanan
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight">
            Rincian paket & ketentuan riasan.
          </h2>
          <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
            Pilih kategori paket di bawah ini untuk melihat daftar harga resmi. Ketuk pada gambar katalog untuk memperbesar tampilan dan membaca detail rincian di layar ponselmu.
          </p>
        </div>

        {/* Navigasi Tab (Horizontal Scrollable di Mobile tanpa scrollbar kasar) */}
        <div className="flex overflow-x-auto gap-2.5 pb-2 mb-8 no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {PACKAGES.map((item) => {
            const isActive = activeTab.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all border flex items-center gap-2 ${
                  isActive
                    ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary shadow-[0_2px_10px_rgba(158,90,84,0.2)]'
                    : 'bg-mbell-canvas text-mbell-ink border-mbell-border hover:bg-mbell-blush/50'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-mbell-surface text-mbell-muted'}`}>
                  {item.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card Pratinjau Katalog Interaktif */}
        <div className="bg-mbell-canvas border border-mbell-border rounded-3xl p-5 sm:p-8 shadow-[0_12px_32px_rgba(42,33,33,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-mbell-border">
            <div className="text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-mbell-ink">
                {activeTab.label}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-mbell-muted mt-1 max-w-xl">
                {activeTab.desc}
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="self-start sm:self-auto inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full bg-mbell-surface text-mbell-primary border border-mbell-border text-xs font-sans font-medium hover:bg-mbell-blush/60 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>Perbesar Katalog</span>
            </button>
          </div>

          {/* Area Gambar Katalog */}
          <div 
            onClick={() => setIsZoomed(true)}
            className="cursor-zoom-in overflow-hidden rounded-2xl bg-mbell-surface max-w-xl mx-auto border border-mbell-border relative group shadow-sm"
          >
            <img
              src={activeTab.image}
              alt={activeTab.label}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-mbell-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-mbell-canvas text-mbell-ink text-xs font-sans font-medium px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6"></path>
                  <path d="M9 21H3v-6"></path>
                  <path d="M21 3l-7 7"></path>
                  <path d="M3 21l7-7"></path>
                </svg>
                Ketuk untuk Zoom
              </span>
            </div>
          </div>

          {/* Tombol Aksi Langsung di Bawah Gambar */}
          <div className="mt-8 pt-6 border-t border-mbell-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left text-xs font-sans text-mbell-muted">
              Ingin menanyakan ketersediaan tanggal atau rincian paket ini?
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleScrollToBooking}
                className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2.5 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-sans text-xs font-medium hover:bg-mbell-blush/60 transition-colors"
              >
                Cek Tanggal di Kalender
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppBooking(activeTab)}
                className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans text-xs font-semibold hover:bg-mbell-ink transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Tanya Paket via WhatsApp</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Lightbox Modal untuk Mobile Zoom (Rendered via createPortal to prevent layout glitches) */}
        {isZoomed && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            <motion.div 
              key="catalog-lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setIsZoomed(false)}
            >
              <motion.div 
                key="catalog-lightbox-card"
                initial={{ scale: 0.94, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 15 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
                className="relative max-w-4xl w-full my-auto text-center" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 mb-2">
                  <span className="text-sm font-sans font-medium text-white/90 text-left">
                    {activeTab.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsZoomed(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium backdrop-blur-md transition-colors"
                  >
                    <span>Tutup Pratinjau</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div className="overflow-auto max-h-[76vh] rounded-2xl bg-mbell-canvas p-2 sm:p-3 shadow-2xl custom-scrollbar border border-white/10">
                  <img
                    src={activeTab.image}
                    alt={activeTab.label}
                    className="w-full h-auto max-h-[72vh] object-contain rounded-xl mx-auto"
                  />
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppBooking(activeTab)}
                    className="min-h-[44px] px-6 py-2 rounded-full bg-mbell-primary text-mbell-canvas font-sans text-xs font-semibold shadow-md hover:bg-mbell-ink transition-colors flex items-center gap-2"
                  >
                    <span>Lanjut Booking via WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
};

export default PriceList;
