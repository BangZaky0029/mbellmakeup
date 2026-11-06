import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Calendar, MessageCircle, X } from 'lucide-react';
import price01 from '../assets/price_01.webp';
import price02 from '../assets/price_02.png';
import price03 from '../assets/price_03.png';
import termsImg from '../assets/term-condition.jpeg';
import RandomTextReveal from './ui/RandomTextReveal';
import Folder from './ui/Folder';
import './ui/Folder.css';

interface PackageItem {
  id: string;
  label: string;
  shortTitle: string;
  image: string;
  desc: string;
  waQuery: string;
  badge?: string;
}

const PACKAGES: PackageItem[] = [
  {
    id: 'paket-1',
    label: 'Katalog Paket 1',
    shortTitle: 'Wedding & Akad',
    image: price01,
    desc: 'Paket riasan pengantin, prosesi akad nikah, resepsi, dan riasan pendamping keluarga.',
    waQuery: 'Halo MBell MakeUp, saya ingin konsultasi mengenai Paket 1 (Wedding & Akad). Boleh minta info detail ketersediaan tanggal dan layanannya?',
    badge: 'Popular'
  },
  {
    id: 'paket-2',
    label: 'Katalog Paket 2',
    shortTitle: 'Wisuda & Lamaran',
    image: price02,
    desc: 'Pilihan riasan wisuda, sesi lamaran (engagement), pre-wedding, dan acara pesta spesial.',
    waQuery: 'Halo MBell MakeUp, saya tertarik dengan Paket 2 (Wisuda, Lamaran, & Pesta). Apakah ada slot kosong untuk tanggal acara saya?',
    badge: 'Favorite'
  },
  {
    id: 'paket-3',
    label: 'Katalog Paket 3',
    shortTitle: 'Layanan Tambahan',
    image: price03,
    desc: 'Riasan keluarga, bridesmaid, hijab do / hair do, dan paket rombongan acara.',
    waQuery: 'Halo MBell MakeUp, saya mau tanya rincian Paket 3 (Layanan Tambahan & Bridesmaid). Mohon info lengkapnya ya kak.',
    badge: 'Lengkap'
  },
  {
    id: 'ketentuan',
    label: 'Syarat & Ketentuan',
    shortTitle: 'Ketentuan & DP',
    image: termsImg,
    desc: 'Panduan tata cara booking jadwal, ketentuan uang muka (DP), pelunasan, dan kebijakan layanan.',
    waQuery: 'Halo MBell MakeUp, saya sudah membaca Syarat & Ketentuan dan ingin melakukan booking jadwal makeup.',
    badge: 'Penting'
  },
];

export const PriceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PackageItem>(PACKAGES[0]);
  const [zoomItem, setZoomItem] = useState<PackageItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Lock body scroll while zoom modal is open
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (zoomItem) {
      document.body.style.overflow = 'hidden';
    } else {
      timeoutId = setTimeout(() => {
        document.body.style.overflow = '';
      }, 240);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = '';
    };
  }, [zoomItem]);

  // Close zoom modal on Escape key
  useEffect(() => {
    if (!zoomItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomItem]);

  // Download Catalog Image to Device
  const handleDownloadCatalog = (pkg: PackageItem) => {
    const safeTitle = pkg.label.replace(/\s+/g, '-');
    const safeShort = pkg.shortTitle.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `MBell-${safeTitle}-${safeShort}.png`;

    fetch(pkg.image)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setDownloadSuccess(pkg.label);
        setTimeout(() => setDownloadSuccess(null), 2500);
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = pkg.image;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setDownloadSuccess(pkg.label);
        setTimeout(() => setDownloadSuccess(null), 2500);
      });
  };

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

  // Prepare custom letter cards for each package inside the 3D Folder
  const folderItems = useMemo(() => {
    return PACKAGES.map((pkg) => ({
      title: pkg.label,
      content: (
        <div className="folder-letter-wrapper group/letter">
          {/* Header of Letter */}
          <div className="px-3 py-2 bg-gradient-to-b from-[#FCF9F6] to-[#F4EBE6]/90 border-b border-[#E6D7D2]/80 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-1">
              <span className="font-serif font-semibold text-[11px] sm:text-xs text-mbell-ink truncate tracking-wide">
                {pkg.label}
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded-full bg-mbell-primary/10 text-mbell-primary uppercase tracking-wider shrink-0">
                {pkg.shortTitle}
              </span>
            </div>
          </div>

          {/* Thumbnail Flyer Image Preview */}
          <div className="folder-letter-thumb">
            <img
              src={pkg.image}
              alt={pkg.label}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/letter:scale-105"
              draggable={false}
            />
            {/* Subtle Gradient Shadow on bottom */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
            
            {/* Short Caption */}
            <div className="absolute bottom-2 left-2.5 right-14 text-left pointer-events-none">
              <p className="text-[9px] sm:text-[10px] font-sans text-white/95 line-clamp-1 font-medium drop-shadow-sm">
                {pkg.desc}
              </p>
            </div>
          </div>

          {/* POJOK KANAN BAWAH LETTER: Tombol Icon Mata (Lihat) & Icon Download */}
          <div className="folder-letter-actions">
            {/* Tombol Icon Mata (Lihat & Perbesar) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(pkg);
                setZoomItem(pkg);
              }}
              className="folder-action-btn folder-action-view"
              title={`Lihat & Perbesar ${pkg.label}`}
              aria-label={`Lihat & Perbesar ${pkg.label}`}
            >
              <Eye size={13} strokeWidth={2.4} />
            </button>

            {/* Tombol Icon Download (Unduh Gambar) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadCatalog(pkg);
              }}
              className="folder-action-btn folder-action-download"
              title={`Download Brosur ${pkg.label}`}
              aria-label={`Download Brosur ${pkg.label}`}
            >
              <Download size={13} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )
    }));
  }, []);

  return (
    <section id="pricelist" className="py-16 md:py-24 bg-mbell-surface/60 border-b border-mbell-border relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Seksi */}
        <div className="max-w-2xl text-left mb-6 sm:mb-8">
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-sans font-semibold tracking-widest uppercase bg-mbell-canvas text-mbell-primary border border-mbell-border mb-3 shadow-sm">
            Daftar Harga & Ketentuan
          </span>
          <RandomTextReveal
            as="h2"
            text="Rincian paket & ketentuan riasan."
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight tracking-tight"
            delayBase={0.1}
          />
          <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
            Pilih atau sentuh map katalog di bawah ini untuk melihat lembaran paket riasan resmi. Klik <strong>icon mata 👁️</strong> di pojok kartu untuk memperbesar dan <strong>icon download 📥</strong> untuk mengunduh brosur ke perangkatmu.
          </p>
        </div>

        {/* Quick Navigasi Tab Pills (Dapat diklik untuk memilih paket aktif) */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 sm:mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {PACKAGES.map((item) => {
            const isActive = activeTab.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap min-h-[42px] px-4 py-2 rounded-full text-xs font-sans transition-all border flex items-center gap-2 ${
                  isActive
                    ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary shadow-[0_2px_12px_rgba(158,90,84,0.25)] font-semibold scale-105'
                    : 'bg-mbell-canvas text-mbell-ink border-mbell-border hover:bg-mbell-blush/60 font-medium'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-mbell-surface text-mbell-muted'}`}>
                  {item.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* STAGE UTAMA: 3D Interactive Folder */}
        <div className="bg-gradient-to-b from-mbell-canvas via-mbell-canvas/90 to-mbell-surface/40 border border-mbell-border rounded-3xl p-6 sm:p-10 shadow-[0_16px_48px_rgba(42,33,33,0.06)] mb-8 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Subtle Top Hint */}
          <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-mbell-border/60 text-xs font-sans text-mbell-muted">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mbell-primary animate-pulse" />
              <span>Map Katalog Riasan MBell MakeUp</span>
            </span>
            <span className="hidden sm:inline">Sentuh / hover folder untuk membuka lembaran</span>
          </div>

          {/* 3D Folder Container */}
          <div className="py-6 sm:py-10 flex items-center justify-center w-full min-h-[320px] sm:min-h-[380px]">
            <Folder
              color="#9E5A54"
              paperColor="#FCF9F6"
              label="Daftar Paket MBell"
              tabPosition="right"
              mode="flap"
              layout="spread"
              size={isMobile ? 1.15 : isTablet ? 1.35 : 1.55}
              openOn="hover"
              defaultOpen={true}
              items={folderItems}
              draggable={true}
              className="mx-auto select-none"
            />
          </div>

          {/* Bottom Card Summary of Active Selected Package */}
          <div className="w-full mt-6 pt-5 border-t border-mbell-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">
                  {activeTab.label}
                </h4>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-mbell-primary/10 text-mbell-primary">
                  {activeTab.shortTitle}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-mbell-muted max-w-xl leading-relaxed">
                {activeTab.desc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setZoomItem(activeTab)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mbell-surface hover:bg-mbell-blush/60 text-mbell-primary border border-mbell-border text-xs font-sans font-semibold transition-colors shadow-sm"
              >
                <Eye size={14} />
                <span>Perbesar Brosur</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCatalog(activeTab)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mbell-canvas hover:bg-mbell-surface text-mbell-ink border border-mbell-border text-xs font-sans font-semibold transition-colors shadow-sm"
              >
                <Download size={14} />
                <span>Unduh Gambar</span>
              </button>

              <button
                type="button"
                onClick={() => handleWhatsAppBooking(activeTab)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-mbell-primary hover:bg-mbell-ink text-white text-xs font-sans font-semibold transition-colors shadow-sm"
              >
                <MessageCircle size={14} />
                <span>Tanya Paket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Banner Navigasi Jadwal & Booking */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-mbell-canvas border border-mbell-border shadow-sm">
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-lg font-medium text-mbell-ink">
              Sudah menemukan tanggal pernikahan atau acara spesialmu?
            </h4>
            <p className="font-sans text-xs text-mbell-muted mt-0.5">
              Cek tanggal kosong pada kalender reservasi resmi MBell MakeUp secara langsung.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScrollToBooking}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mbell-surface hover:bg-mbell-blush/60 text-mbell-ink border border-mbell-border font-sans text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <Calendar size={14} />
            <span>Lihat Kalender Booking</span>
          </button>
        </div>

        {/* Download Success Toast Notification */}
        <AnimatePresence>
          {downloadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] px-5 py-2.5 rounded-full bg-mbell-ink text-white text-xs font-sans font-medium shadow-2xl flex items-center gap-2 border border-white/10"
            >
              <Download size={14} className="text-mbell-rose" />
              <span>Brosur <strong>{downloadSuccess}</strong> berhasil diunduh!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox Modal untuk Mobile & Desktop Zoom */}
        {zoomItem && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            <motion.div
              key="catalog-lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setZoomItem(null)}
            >
              <motion.div
                key="catalog-lightbox-card"
                initial={{ scale: 0.94, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-4xl w-full my-auto text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Lightbox */}
                <div className="flex items-center justify-between pb-3 mb-2 px-1">
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-sm font-sans font-semibold text-white">
                      {zoomItem.label}
                    </span>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                      {zoomItem.shortTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadCatalog(zoomItem)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium backdrop-blur-md transition-colors"
                      title="Download Gambar Brosur"
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setZoomItem(null)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium backdrop-blur-md transition-colors"
                    >
                      <X size={15} />
                      <span className="hidden sm:inline">Tutup</span>
                    </button>
                  </div>
                </div>

                {/* High-Resolution Image Canvas */}
                <div className="overflow-auto max-h-[76vh] rounded-2xl bg-[#FCF9F6] p-2 sm:p-3 shadow-2xl custom-scrollbar border border-white/10">
                  <img
                    src={zoomItem.image}
                    alt={zoomItem.label}
                    className="w-full h-auto max-h-[72vh] object-contain rounded-xl mx-auto"
                  />
                </div>

                {/* Bottom WhatsApp Inquiry */}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppBooking(zoomItem)}
                    className="min-h-[44px] px-6 py-2.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans text-xs font-semibold shadow-lg hover:bg-mbell-ink transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>Lanjut Booking via WhatsApp</span>
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
