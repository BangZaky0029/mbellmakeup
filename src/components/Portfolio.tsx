import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, CATEGORY_LABELS } from '../constants';
import type { Category, PortfolioItem } from '../types';
import { supabase } from '../lib/supabase';
import RandomTextReveal from './ui/RandomTextReveal';
import OptionWheel from './ui/OptionWheel';
import DriftWall, { type DriftWallItem } from './ui/DriftWall';

interface PortfolioProps {
  onOpenGallery: (items: PortfolioItem[], category: string) => void;
  onItemClick: (item: PortfolioItem) => void;
}

// Curated fallback items if database is loading or offline
const FALLBACK_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: 'Akad Sunda Siger Elok',
    category: 'akad',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    description: 'Riasan akad tradisional dengan siger megah dan sentuhan modern soft glam.',
    details: 'Complexion flawless velvet finish dengan ronce melati segar dan lipstik nude pink hangat.'
  },
  {
    id: 2,
    title: 'Modern Flawless Bride',
    category: 'akadTanpaSiger',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: 'Look akad bersih dengan riasan mata berdimensi dan veil transparan minimalis.',
    details: 'Fokus pada kesehatan kulit, natural glowing glow, dan soft contouring.'
  },
  {
    id: 3,
    title: 'Editorial Glow Beauty Shoot',
    category: 'BeautyShoot',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'High-fashion beauty makeup dengan kilau dewy dan eye detailing presisi.',
    details: 'Sangat cocok untuk pemotretan komersial, katalog, dan portofolio editorial.'
  },
  {
    id: 4,
    title: 'Glamour Night Pesta',
    category: 'pesta',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    description: 'Makeup pesta anggun tahan lama dengan shimmer hangat dan bibir tegas.',
    details: 'Ketahanan makeup hingga 12 jam dengan formula sweatproof dan flashback-safe.'
  },
  {
    id: 5,
    title: 'Wisuda Fresh & Youthful',
    category: 'wisuda',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Riasan wisuda cerah segar yang mempertegas senyum manis di hari kelulusan.',
    details: 'Tekstur ringan, tidak dempul, dan hasil foto kamera wisuda tetap tajam natural.'
  },
  {
    id: 6,
    title: 'Romantic Sunset Prewedding',
    category: 'preWedding',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Look prewedding outdoor hangat yang menyatu harmonis dengan cahaya senja.',
    details: 'Makeup tahan angin dan sinar matahari outdoor dengan ketahanan prima.'
  },
  {
    id: 7,
    title: 'Siraman Tradisional Ayem',
    category: 'siraman',
    imageUrl: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Riasan siraman lembut bersahaja dengan ronce bunga melati klasik.',
    details: 'Formula waterproof khusus prosesi siraman adat.'
  },
  {
    id: 8,
    title: 'Lamaran Sweet Peachy',
    category: 'Lamaran',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    description: 'Sentuhan peach dan coral romantis untuk momen pertemuan dua keluarga.',
    details: 'Harmonisasi warna kebaya/dress dengan palet riasan wajah.'
  }
];

const normalize = (val: string): string =>
  val.toLowerCase().replace(/[\s_-]/g, '');

const Portfolio: React.FC<PortfolioProps> = ({ onOpenGallery, onItemClick }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive window tracker
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Fetch Supabase data
  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('images')
          .select('*')
          .order('id', { ascending: true });

        if (!fetchError && data && data.length > 0) {
          if (isMounted) setPortfolioData(data as PortfolioItem[]);
        } else {
          if (isMounted) setPortfolioData(FALLBACK_ITEMS);
        }
      } catch (err) {
        console.error('Error fetching portfolio from Supabase:', err);
        if (isMounted) setPortfolioData(FALLBACK_ITEMS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute category options list
  const categoryOptions = useMemo(() => {
    const options: { key: string; label: string; count: number }[] = [
      { key: 'all', label: 'Semua Look', count: portfolioData.length }
    ];

    // Collect counts by normalized category
    const countMap = new Map<string, number>();
    portfolioData.forEach(item => {
      const norm = normalize(item.category || '');
      countMap.set(norm, (countMap.get(norm) || 0) + 1);
    });

    // Add standard categories
    CATEGORIES.forEach(catKey => {
      const norm = normalize(catKey);
      const label = CATEGORY_LABELS[catKey] || catKey;
      const count = countMap.get(norm) || 0;
      options.push({
        key: catKey,
        label,
        count
      });
    });

    // Add any extra categories from DB that might not be in standard list
    portfolioData.forEach(item => {
      const rawCat = item.category?.trim();
      if (!rawCat) return;
      const norm = normalize(rawCat);
      const alreadyListed = options.some(opt => normalize(opt.key) === norm);
      if (!alreadyListed) {
        options.push({
          key: rawCat,
          label: rawCat.charAt(0).toUpperCase() + rawCat.slice(1),
          count: countMap.get(norm) || 1
        });
      }
    });

    return options;
  }, [portfolioData]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategoryKey === 'all') {
      return portfolioData;
    }
    const normActive = normalize(activeCategoryKey);
    const matched = portfolioData.filter(
      item => normalize(item.category || '') === normActive
    );
    return matched.length > 0 ? matched : portfolioData;
  }, [activeCategoryKey, portfolioData]);

  // Convert to DriftWallItem format
  const driftItems = useMemo<DriftWallItem[]>(() => {
    const list = filteredItems.length > 0 ? filteredItems : FALLBACK_ITEMS;
    return list.map(item => ({
      image: item.imageUrl,
      title: item.title,
      category: CATEGORY_LABELS[item.category as Category] || item.category,
      description: item.description,
      rawItem: item
    }));
  }, [filteredItems]);

  const activeCategoryLabel = useMemo(() => {
    const found = categoryOptions.find(c => c.key === activeCategoryKey);
    return found ? found.label : 'Semua Look';
  }, [categoryOptions, activeCategoryKey]);

  const handleWheelChange = (index: number) => {
    if (index >= 0 && index < categoryOptions.length) {
      setActiveCategoryIndex(index);
      setActiveCategoryKey(categoryOptions[index].key);
    }
  };

  const handleTileClick = (item: DriftWallItem) => {
    if (item.rawItem) {
      onItemClick(item.rawItem as PortfolioItem);
    }
  };

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="py-16 md:py-24 relative z-10 overflow-hidden bg-mbell-canvas border-b border-mbell-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
          <div className="max-w-2xl text-left">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-sans font-semibold tracking-widest uppercase bg-mbell-surface text-mbell-primary border border-mbell-border/80 mb-3 shadow-sm">
              Portfolio & Visual Showcase
            </span>
            <RandomTextReveal
              as="h2"
              text="Galeri riasan & transformasi."
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight tracking-tight"
              delayBase={0.1}
            />
            <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
              Setiap wajah memiliki keunikan tersendiri. Kami memadukan warna, teknik kontur, dan kelembutan tekstur untuk menonjolkan kecantikanmu di setiap sudut foto.
            </p>
          </div>

          {/* Quick Active Badge & Direct Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mbell-surface border border-mbell-border text-xs font-sans text-mbell-ink shadow-sm">
              <span className="w-2 h-2 rounded-full bg-mbell-primary animate-ping" />
              <span>
                Tema Aktif: <strong className="font-semibold text-mbell-primary">{activeCategoryLabel}</strong>
              </span>
              <span className="text-mbell-muted">({filteredItems.length} Foto)</span>
            </div>

            <button
              type="button"
              onClick={() => onOpenGallery(portfolioData, activeCategoryKey)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mbell-surface hover:bg-mbell-surface/80 text-mbell-ink border border-mbell-border font-sans font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow"
            >
              <span>Semua Galeri</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: OptionWheel (Left) + DriftWall (Right) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-mbell-border bg-gradient-to-br from-mbell-surface/60 via-mbell-canvas to-mbell-surface/40 backdrop-blur-md overflow-hidden shadow-[0_16px_48px_rgba(42,33,33,0.06)]">
          {/* Subtle Stage Top Bar */}
          <div className="h-10 sm:h-12 border-b border-mbell-border/80 px-4 sm:px-6 flex items-center justify-between bg-mbell-surface/40 backdrop-blur-sm z-20 relative">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mbell-primary" />
              <span className="text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-widest text-mbell-muted">
                Menu Kategori Riasan
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-sans text-mbell-muted">
              <span className="hidden sm:inline">↕ Scroll menu atau scroll/drag foto di dalam container</span>
              <span className="sm:hidden font-medium text-mbell-primary">{activeCategoryLabel}</span>
            </div>
          </div>

          {/* Split Stage Area */}
          <div 
            data-scroll-isolated="true"
            className="relative flex flex-row h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] w-full overflow-hidden [overscroll-behavior:contain]"
          >
            {/* LEFT COLUMN: OptionWheel (Category Picker) */}
            <div 
              data-scroll-isolated="true"
              className="w-[38%] sm:w-[32%] md:w-[28%] lg:w-[26%] h-full relative border-r border-mbell-border/80 bg-gradient-to-r from-mbell-surface/70 via-mbell-surface/40 to-transparent flex flex-col justify-between py-4 sm:py-6 z-10 [overscroll-behavior:contain]"
            >
              {/* OptionWheel Component */}
              <div className="flex-1 w-full h-full relative overflow-hidden">
                <OptionWheel
                  items={categoryOptions.map(c => c.label)}
                  defaultSelected={0}
                  selectedIndex={activeCategoryIndex}
                  onChange={handleWheelChange}
                  side="left"
                  textColor="#786866"
                  activeColor="#9E5A54"
                  fontSize={isMobile ? 1.25 : isTablet ? 1.85 : 2.25}
                  spacing={isMobile ? 1.35 : 1.38}
                  curve={isMobile ? 0.75 : 0.9}
                  tilt={isMobile ? 5.5 : 7}
                  blur={isMobile ? 1.2 : 1.8}
                  fade={0.3}
                  minOpacity={0.06}
                  smoothing={210}
                  inset={isMobile ? 14 : isTablet ? 26 : 36}
                  draggable={true}
                  className="h-full"
                />
              </div>

              {/* Bottom Wheel Status Info */}
              <div className="px-3 sm:px-6 pt-2 z-10 flex flex-col gap-0.5 text-left border-t border-mbell-border/40">
                <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-widest text-mbell-muted/80">
                  Foto Terkatalog
                </span>
                <span className="font-serif text-sm sm:text-base font-semibold text-mbell-primary">
                  {filteredItems.length} Look Cantik
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: DriftWall (Infinite 3D Drifting Tiles) */}
            <div 
              data-scroll-isolated="true"
              className="flex-1 h-full relative overflow-hidden bg-gradient-to-br from-transparent to-mbell-surface/20 [overscroll-behavior:contain]"
            >
              {loading ? (
                <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-mbell-muted">
                  <div className="w-9 h-9 border-2 border-mbell-rose border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-sans text-xs tracking-wide">Memuat galeri foto...</span>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategoryKey}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="h-full w-full"
                  >
                    <DriftWall
                      items={driftItems}
                      columns={isMobile ? 2 : isTablet ? 3 : 4}
                      tileWidth={isMobile ? 120 : isTablet ? 155 : 185}
                      tileHeight={isMobile ? 165 : isTablet ? 215 : 255}
                      gap={isMobile ? 10 : 14}
                      radius={isMobile ? 12 : 16}
                      tilt={isMobile ? 10 : 13}
                      turn={isMobile ? -8 : -11}
                      perspective={isMobile ? 850 : 1100}
                      depth={isMobile ? 60 : 85}
                      speed={isMobile ? 26 : 34}
                      lift={isMobile ? 28 : 48}
                      dim={0.62}
                      fade={0.55}
                      overlayColor="#2A2121"
                      pauseOnHover={true}
                      onItemClick={handleTileClick}
                      className="h-full w-full"
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Floating Interaction Pill Guide on DriftWall */}
              <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mbell-canvas/90 backdrop-blur-md border border-mbell-border text-[11px] font-sans text-mbell-ink shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-mbell-rose" />
                <span>Klik foto mana pun untuk memperbesar & konsultasi look</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-mbell-surface/50 border border-mbell-border">
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-lg font-medium text-mbell-ink">
              Tertarik dengan salah satu gaya riasan di atas?
            </h4>
            <p className="font-sans text-xs text-mbell-muted mt-0.5">
              Konsultasikan tema kebaya, bentuk wajah, dan look impianmu langsung dengan tim kami.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://wa.me/6288293473765?text=Halo%20MBell%20MakeUp%2C%20saya%20tertarik%20konsultasi%20look%20portfolio%20riasan%20terbaru."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-xs sm:text-sm hover:bg-mbell-ink transition-colors shadow-sm"
            >
              Konsultasi via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => onOpenGallery(portfolioData, activeCategoryKey)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-mbell-canvas text-mbell-ink border border-mbell-border font-sans font-medium text-xs sm:text-sm hover:bg-mbell-blush/60 transition-colors"
            >
              Buka Katalog Lengkap ({portfolioData.length})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
