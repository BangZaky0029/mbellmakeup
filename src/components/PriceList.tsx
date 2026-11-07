import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Calendar, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RandomTextReveal from './ui/RandomTextReveal';
import Folder from './ui/Folder';
import './ui/Folder.css';
import InteractiveLightbox from './ui/InteractiveLightbox';

interface PackageItem {
  id: string;
  label: string;
  shortTitle: string;
  image: string;
  desc: string;
  waQuery: string;
  badge?: string;
}

const SUPABASE_CATALOGUE_BUCKET_URL =
  'https://fsbvnkwxwvffghrdxnxr.supabase.co/storage/v1/object/public/images_mbell/catalogue';

const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: '1',
    label: 'Katalog Paket 1',
    shortTitle: 'Wedding & Akad',
    image: `${SUPABASE_CATALOGUE_BUCKET_URL}/price_01.webp`,
    desc: 'Paket riasan pengantin, prosesi akad nikah, resepsi, dan riasan pendamping keluarga.',
    waQuery: 'Halo MBell MakeUp, saya ingin konsultasi mengenai Paket 1 (Wedding & Akad). Boleh minta info detail ketersediaan tanggal dan layanannya?',
    badge: 'Popular'
  },
  {
    id: '2',
    label: 'Katalog Paket 2',
    shortTitle: 'Wisuda & Lamaran',
    image: `${SUPABASE_CATALOGUE_BUCKET_URL}/price_02.png`,
    desc: 'Pilihan riasan wisuda, sesi lamaran (engagement), pre-wedding, dan acara pesta spesial.',
    waQuery: 'Halo MBell MakeUp, saya tertarik dengan Paket 2 (Wisuda, Lamaran, & Pesta). Apakah ada slot kosong untuk tanggal acara saya?',
    badge: 'Favorite'
  },
  {
    id: '3',
    label: 'Katalog Paket 3',
    shortTitle: 'Layanan Tambahan',
    image: `${SUPABASE_CATALOGUE_BUCKET_URL}/price_03.png`,
    desc: 'Riasan keluarga, bridesmaid, hijab do / hair do, dan paket rombongan acara.',
    waQuery: 'Halo MBell MakeUp, saya mau tanya rincian Paket 3 (Layanan Tambahan & Bridesmaid). Mohon info lengkapnya ya kak.',
    badge: 'Lengkap'
  },
  {
    id: '4',
    label: 'Syarat & Ketentuan',
    shortTitle: 'Ketentuan & DP',
    image: `${SUPABASE_CATALOGUE_BUCKET_URL}/S&K.jpeg`,
    desc: 'Panduan tata cara booking jadwal, ketentuan uang muka (DP), pelunasan, dan kebijakan layanan.',
    waQuery: 'Halo MBell MakeUp, saya sudah membaca Syarat & Ketentuan dan ingin melakukan booking jadwal makeup.',
    badge: 'Penting'
  },
];

export const PriceList: React.FC = () => {
  const [packages, setPackages] = useState<PackageItem[]>(INITIAL_PACKAGES);
  const [activeTab, setActiveTab] = useState<PackageItem>(INITIAL_PACKAGES[0]);
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

  // Fetch Catalogue dynamically from Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchCatalogue = async () => {
      try {
        const { data, error } = await supabase
          .from('catalogue')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: PackageItem[] = data.map((item: any) => ({
            id: String(item.id),
            label: item.label,
            shortTitle: item.short_title,
            image: item.image_url,
            desc: item.description || '',
            waQuery: item.wa_query || `Halo MBell MakeUp, saya ingin tanya mengenai ${item.label}`,
            badge: item.badge || undefined,
          }));
          setPackages(mapped);
          setActiveTab((prev) => {
            const found = mapped.find((p) => p.id === prev.id || p.label === prev.label);
            return found || mapped[0];
          });
        }
      } catch (err) {
        console.warn('Gagal memuat katalog dari Supabase, menggunakan data cadangan:', err);
      }
    };

    fetchCatalogue();

    // Supabase Realtime Subscription: Update otomatis saat ada perubahan di tabel catalogue
    const channel = supabase
      .channel('catalogue_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'catalogue' },
        () => {
          fetchCatalogue();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
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
    return packages.map((pkg) => ({
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
  }, [packages]);

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
              size={isMobile ? 1.05 : isTablet ? 1.25 : 1.45}
              openOn="hover"
              defaultOpen={false}
              items={folderItems}
              draggable={true}
              className="mx-auto select-none"
            />
          </div>

          {/* Bottom Card Summary of Active Selected Package + Right Side Package Buttons Column */}
          <div className="w-full mt-6 pt-5 border-t border-mbell-border/70 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* SISI KIRI: Detail Paket Aktif & Action Buttons */}
            <div className="text-left flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">
                    {activeTab.label}
                  </h4>
                  <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-mbell-primary/10 text-mbell-primary">
                    {activeTab.shortTitle}
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-mbell-muted leading-relaxed max-w-xl">
                  {activeTab.desc}
                </p>
              </div>

              {/* Action Buttons for Active Package */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => handleWhatsAppBooking(activeTab)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mbell-primary hover:bg-mbell-ink text-white text-xs font-sans font-semibold transition-colors shadow-sm"
                >
                  <MessageCircle size={14} />
                  <span>Tanya Paket via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* SISI KANAN: Kolom Tombol Pilihan Paket & S&K dengan Icon View (Mata) & Download */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2 min-w-full sm:min-w-[320px] lg:min-w-[360px]">
              {packages.map((item) => {
                const isActive = activeTab.id === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveTab(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab(item);
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all border flex items-center justify-between gap-2.5 text-left cursor-pointer select-none ${
                      isActive
                        ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary shadow-[0_4px_16px_rgba(158,90,84,0.25)] font-semibold'
                        : 'bg-mbell-canvas hover:bg-mbell-surface text-mbell-ink border-mbell-border/80 hover:border-mbell-border font-medium shadow-xs'
                    }`}
                  >
                    {/* Sisi Kiri: Label Paket & Kategori Singkat */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{item.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-normal ${
                          isActive
                            ? 'bg-white/20 text-white font-medium'
                            : 'bg-mbell-surface text-mbell-muted'
                        }`}
                      >
                        {item.shortTitle}
                      </span>
                    </div>

                    {/* Sisi Kanan: Action Icons {icon view} {icon download} */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(item);
                          setZoomItem(item);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-white/15 hover:bg-white text-white hover:text-mbell-primary border border-white/20 shadow-xs'
                            : 'bg-mbell-surface hover:bg-mbell-blush/80 text-mbell-ink hover:text-mbell-primary border border-mbell-border/70 shadow-xs'
                        }`}
                        title={`Perbesar brosur ${item.label}`}
                        aria-label={`Perbesar brosur ${item.label}`}
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCatalog(item);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-white/15 hover:bg-white text-white hover:text-mbell-primary border border-white/20 shadow-xs'
                            : 'bg-mbell-surface hover:bg-mbell-blush/80 text-mbell-ink hover:text-mbell-primary border border-mbell-border/70 shadow-xs'
                        }`}
                        title={`Unduh brosur ${item.label}`}
                        aria-label={`Unduh brosur ${item.label}`}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
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

        {/* Interactive Lightbox Modal untuk Desktop & Mobile */}
        <InteractiveLightbox
          item={zoomItem}
          onClose={() => setZoomItem(null)}
          onDownload={handleDownloadCatalog}
          onWhatsApp={handleWhatsAppBooking}
        />

      </div>
    </section>
  );
};

export default PriceList;
