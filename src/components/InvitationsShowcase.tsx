import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { InvitationTemplate } from '../types';

const SUPABASE_MOCKUP_BASE = 'https://fsbvnkwxwvffghrdxnxr.supabase.co/storage/v1/object/public/invitations/mock-up_Template';
const INVITATIONS_WEB_URL = 'https://mbellinvitations.vercel.app';
const ADMIN_WA_NUMBER = '6288293473765';

// Fallback seeds jika Supabase belum selesai fetch pertama kali atau offline
const DEFAULT_FALLBACK_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'template1',
    slug: 'modern-arch',
    name: 'Modern Editorial Arch',
    category: 'modern',
    description: 'Gaya tipografi editorial majalah bernuansa champagne emas dan bingkai arch melengkung mewah.',
    preview_badge: 'Trending',
    accent_color: '#D4AF37',
    price: 49000,
    original_price: 79000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template1-modern.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template1-modern.jpg`,
    is_active: true
  },
  {
    id: 'template2',
    slug: 'rustic-casual',
    name: 'Rustic Earthy Sage',
    category: 'modern',
    description: 'Nuansa hangat botanical dedaunan sage green, terracotta earthy, dan estetika casual santai.',
    preview_badge: 'Popular',
    accent_color: '#556B2F',
    price: 49000,
    original_price: 79000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template2-rustic.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template2-rustic.jpg`,
    is_active: true
  },
  {
    id: 'template6',
    slug: 'adat-sunda',
    name: 'Adat Sunda Siger',
    category: 'adat',
    description: 'Mahkota Siger & Ronce Melati Tradisi Parahyangan nan anggun dan sakral.',
    preview_badge: 'Royal Adat',
    accent_color: '#C5A059',
    price: 79000,
    original_price: 99000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template6-sunda-siger.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template6-sunda-siger.jpg`,
    is_active: true
  },
  {
    id: 'template7',
    slug: 'adat-minang',
    name: 'Adat Minang Baralek Gadang',
    category: 'adat',
    description: 'Kemewahan Suntiang Gadang & Songket Silungkang berbalut nuansa marun emas kerajaan.',
    preview_badge: 'New Royal',
    accent_color: '#D4AF37',
    price: 79000,
    original_price: 99000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template_7_Minang.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template_7_Minang.jpg`,
    is_active: true
  },
  {
    id: 'template3',
    slug: 'adat-jawa',
    name: 'Adat Jawa Royal Keraton',
    category: 'adat',
    description: 'Tradisi luhur Keraton Jawa beraksen Gunungan Wayang emas prada dan motif Kawung klasik.',
    preview_badge: 'Best Choice',
    accent_color: '#C5A059',
    price: 79000,
    original_price: 99000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template3-jawa.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template3-jawa.jpg`,
    is_active: true
  },
  {
    id: 'template8',
    slug: 'adat-batak',
    name: 'Adat Batak Toba Royal',
    category: 'adat',
    description: 'Pemberkatan Nikah Kudus & Pesta Adat Batak Toba Mangulosi beraksen Ulos Ragi Hotang.',
    preview_badge: 'Royal Adat',
    accent_color: '#C8A253',
    price: 79000,
    original_price: 99000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template8-batak.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template8-batak.jpg`,
    is_active: true
  },
  {
    id: 'template4',
    slug: 'islami-maroko',
    name: 'Islami Kubah Maroko',
    category: 'modern',
    description: 'Sentuhan arsitektur kubah lengkung Maroko bernuansa burgundy hangat dan kaligrafi suci.',
    preview_badge: 'Exclusive',
    accent_color: '#5E2832',
    price: 49000,
    original_price: 79000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template4-islami.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template4-islami.jpg`,
    is_active: true
  },
  {
    id: 'template5',
    slug: 'luxury-glamour',
    name: 'Luxury Midnight Gold',
    category: 'modern',
    description: 'Kemewahan ultra-eksklusif tema gelap deep charcoal & midnight navy dipadu shimmer emas.',
    preview_badge: 'VIP Only',
    accent_color: '#E2C792',
    price: 49000,
    original_price: 79000,
    thumbnail_url: `${SUPABASE_MOCKUP_BASE}/template5-luxury.jpg`,
    mockup_url: `${SUPABASE_MOCKUP_BASE}/template5-luxury.jpg`,
    is_active: true
  }
];

const formatCurrency = (amount?: number) => {
  if (!amount || isNaN(amount)) return 'Rp 49.000';
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
};

export const InvitationsShowcase: React.FC = () => {
  // State data murni dinamis
  const [templates, setTemplates] = useState<InvitationTemplate[]>(DEFAULT_FALLBACK_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPreview, setSelectedPreview] = useState<InvitationTemplate | null>(null);

  // Slider horizontal navigation
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Fungsi fetch data murni dari Supabase table 'templates'
  const loadTemplatesFromDb = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (error) {
        console.warn('[InvitationsShowcase] Gagal memuat dari Supabase, menggunakan cache fallback:', error.message);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        // Map data murni dinamis tanpa hardcode
        const mappedTemplates: InvitationTemplate[] = data.map((item: any) => ({
          id: String(item.id || ''),
          name: item.name || 'Undangan Eksklusif',
          slug: item.slug || String(item.id || ''),
          category: item.category || 'modern',
          description: item.description || 'Desain undangan pernikahan digital elegan & interaktif.',
          thumbnail_url: item.thumbnail_url || item.mockup_url || `${SUPABASE_MOCKUP_BASE}/template1-modern.jpg`,
          mockup_url: item.mockup_url || item.thumbnail_url || `${SUPABASE_MOCKUP_BASE}/template1-modern.jpg`,
          preview_badge: item.preview_badge || undefined,
          accent_color: item.accent_color || '#9E5A54',
          price: Number(item.price) || 49000,
          original_price: Number(item.original_price) || 79000,
          is_active: item.is_active !== undefined ? Boolean(item.is_active) : true
        }));

        setTemplates(mappedTemplates);
      }
    } catch (err) {
      console.warn('[InvitationsShowcase] Terjadi exception saat fetch templates:', err);
    }
  };

  // 1. Initial Load & Supabase Realtime Listener
  // Apabila ada template baru di Supabase, otomatis ter-load tanpa hardcode
  useEffect(() => {
    loadTemplatesFromDb();

    // Setup Supabase Realtime Subscription untuk tabel 'templates'
    const channel = supabase
      .channel('realtime_templates_showcase')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'templates' },
        (payload) => {
          console.log('[InvitationsShowcase Realtime Update]', payload);
          loadTemplatesFromDb();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Kategori diambil murni dinamis dari kumpulan data templates di DB
  const dynamicCategories = useMemo(() => {
    const rawCategories = templates
      .map((t) => t.category?.trim().toLowerCase())
      .filter((cat): cat is string => Boolean(cat));
    const unique = Array.from(new Set(rawCategories));
    return ['all', ...unique];
  }, [templates]);

  // 3. Filter templates sesuai kategori yang dipilih
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates;
    return templates.filter(
      (t) => t.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [templates, selectedCategory]);

  // Update status scroll button (can scroll left / right)
  const checkScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollState();
    const currentRef = sliderRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [filteredTemplates]);

  // Slider Scroll Handler (kiri / kanan)
  const slide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const step = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth'
    });
  };

  // Safe scroll lock without layout shifting or exit blink/jerk
  useEffect(() => {
    let timeoutId: any;
    if (selectedPreview) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Delay releasing scroll lock until exit animation completes (280ms)
      timeoutId = setTimeout(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 280);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [selectedPreview]);

  // Escape key handler for preview modal
  useEffect(() => {
    if (!selectedPreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPreview(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPreview]);

  // Handler WhatsApp konsultasi paket
  const handleConsultWhatsApp = (templateName: string) => {
    const text = `Halo MBell MakeUp & Invitations, saya tertarik dengan template undangan "${templateName}". Apakah ada penawaran bundling khusus dengan paket riasan MBell MakeUp?`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encoded}`, '_blank');
  };

  // Helper untuk menangani URL gambar mock-up yang mungkin berbeda penamaan di Supabase Storage
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const currentSrc = target.src;

    if (currentSrc.includes('template_7_Minang.jpg')) {
      target.src = currentSrc.replace('template_7_Minang.jpg', 'template7-minang.jpg');
      return;
    }
    if (currentSrc.includes('template7-minang.jpg')) {
      target.src = currentSrc.replace('template7-minang.jpg', 'template_7_minang.jpg');
      return;
    }
    if (currentSrc.includes('template3-jawa-keraton.jpg')) {
      target.src = currentSrc.replace('template3-jawa-keraton.jpg', 'template3-jawa.jpg');
      return;
    }

    // Jika tetap gagal, sembunyikan img dan biarkan placeholder background aktif
    target.style.opacity = '0';
  };

  return (
    <section id="invitations" className="relative py-20 bg-mbell-canvas overflow-hidden border-t border-mbell-border/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Header Showcase Minimalis */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mbell-blush/60 border border-mbell-rose/30 text-mbell-primary text-xs font-sans font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-mbell-primary animate-pulse" />
              <span>MBell Wedding Suite & Undangan Digital</span>
            </div>
            
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-mbell-ink font-medium tracking-tight">
              Koleksi Undangan Digital
            </h2>
            <p className="font-sans text-xs sm:text-sm text-mbell-muted max-w-xl mt-1.5 leading-relaxed">
              Desain undangan digital responsif yang senada dengan konsep riasan dan busana pernikahanmu. Geser untuk melihat semua pilihan template.
            </p>
          </div>

          {/* Navigasi Slide Kiri / Kanan & Link Web */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <a
              href={INVITATIONS_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans font-semibold text-mbell-primary hover:text-mbell-ink transition-colors flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-mbell-surface"
            >
              <span>Lihat Semua di Web Undangan</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => slide('left')}
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-mbell-border bg-mbell-surface text-mbell-ink hover:border-mbell-primary hover:text-mbell-primary active:scale-95 shadow-sm'
                    : 'border-mbell-border/40 bg-mbell-surface/30 text-mbell-muted/40 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => slide('right')}
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-mbell-border bg-mbell-surface text-mbell-ink hover:border-mbell-primary hover:text-mbell-primary active:scale-95 shadow-sm'
                    : 'border-mbell-border/40 bg-mbell-surface/30 text-mbell-muted/40 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Pills Filter */}
        {dynamicCategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {dynamicCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              const label =
                cat === 'all'
                  ? 'Semua Template'
                  : cat === 'adat'
                  ? 'Adat Nusantara'
                  : cat === 'modern'
                  ? 'Modern & Editorial'
                  : cat.charAt(0).toUpperCase() + cat.slice(1);

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (sliderRef.current) {
                      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-mbell-primary text-mbell-canvas shadow-xs'
                      : 'bg-mbell-surface/80 text-mbell-muted hover:text-mbell-ink border border-mbell-border/60 hover:bg-mbell-surface'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDER 1 BARIS (HORIZONTAL SCROLL / SLIDE BISA DIGESER KANAN KIRI) */}
        {/* ========================================================================= */}
        <div className="relative -mx-5 sm:-mx-8 px-5 sm:px-8">
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-6 px-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredTemplates.map((template) => {
              const badgeText = template.preview_badge || (template.category === 'adat' ? 'Adat' : 'Modern');
              const hasDiscount = template.original_price && template.price && template.original_price > template.price;
              const discountPercent = hasDiscount
                ? Math.round(((template.original_price! - template.price!) / template.original_price!) * 100)
                : 0;

              return (
                <div
                  key={template.id}
                  className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0 snap-start bg-mbell-surface rounded-2xl border border-mbell-border/80 shadow-[0_2px_12px_rgba(42,33,33,0.03)] hover:shadow-[0_8px_24px_rgba(42,33,33,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-mbell-rose/60"
                >
                  {/* Smartphone Mock-Up Preview Box */}
                  <div
                    onClick={() => setSelectedPreview(template)}
                    className="relative w-full aspect-[4/5] bg-gradient-to-b from-mbell-surface to-mbell-canvas overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    {/* Fallback pattern jika image loading */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-60"
                      style={{
                        background: `radial-gradient(circle at center, ${template.accent_color || '#9E5A54'}15 0%, transparent 70%)`
                      }}
                    >
                      <span className="font-serif text-lg font-medium text-mbell-ink/40 tracking-wider">
                        {template.name}
                      </span>
                    </div>

                    {/* Image Mockup Dinamis */}
                    <img
                      src={template.mockup_url || template.thumbnail_url}
                      alt={template.name}
                      onError={handleImageError}
                      loading="lazy"
                      className="relative z-10 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge Pill di Pojok Atas */}
                    <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5">
                      {badgeText && (
                        <span className="px-2.5 py-0.5 rounded-full bg-mbell-canvas/90 backdrop-blur-md border border-mbell-border text-mbell-ink font-sans text-[10px] font-semibold tracking-wide shadow-xs">
                          {badgeText}
                        </span>
                      )}
                    </div>

                    {/* Badge Diskon di Pojok Kanan Atas */}
                    {hasDiscount && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="px-2 py-0.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans text-[10px] font-bold tracking-tight shadow-xs">
                          Hemat {discountPercent}%
                        </span>
                      </div>
                    )}

                    {/* Overlay Zoom Saat Hover */}
                    <div className="absolute inset-0 z-20 bg-mbell-ink/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-3.5 py-1.5 rounded-full bg-mbell-canvas/95 text-mbell-ink font-sans text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <span>Perbesar Mockup</span>
                      </div>
                    </div>
                  </div>

                  {/* Konten Card (Detail Murni Dinamis dari Record DB) */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3
                        onClick={() => setSelectedPreview(template)}
                        className="font-serif text-base sm:text-lg text-mbell-ink font-medium tracking-tight truncate cursor-pointer hover:text-mbell-primary transition-colors"
                        title={template.name}
                      >
                        {template.name}
                      </h3>

                      <p className="font-sans text-xs text-mbell-muted leading-relaxed line-clamp-2 mt-1 mb-3">
                        {template.description || 'Desain elegan responsif siap pakai untuk momen sakral pernikahan.'}
                      </p>
                    </div>

                    {/* Harga & Tombol Aksi */}
                    <div className="pt-3 border-t border-mbell-border/60">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          {hasDiscount && (
                            <span className="font-sans text-[11px] text-mbell-muted/70 line-through mr-1.5">
                              {formatCurrency(template.original_price)}
                            </span>
                          )}
                          <span className="font-sans text-sm sm:text-base font-semibold text-mbell-primary">
                            {formatCurrency(template.price)}
                          </span>
                        </div>

                        <span className="font-sans text-[10px] text-mbell-muted uppercase tracking-wider font-medium">
                          {template.category}
                        </span>
                      </div>

                      {/* Tombol Aksi Cepat */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPreview(template)}
                          className="w-full py-1.5 px-2 rounded-lg bg-mbell-surface text-mbell-ink border border-mbell-border font-sans text-xs font-medium hover:bg-mbell-blush/50 transition-colors text-center"
                        >
                          Detail
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleConsultWhatsApp(template.name)}
                          className="w-full py-1.5 px-2 rounded-lg bg-mbell-primary text-mbell-canvas font-sans text-xs font-medium hover:bg-mbell-ink transition-colors text-center shadow-xs"
                        >
                          Tanya WA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradien Fader samping kanan & kiri untuk memberi sinyal scroll visual */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-mbell-canvas to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-mbell-canvas to-transparent" />
          )}
        </div>

        {/* Small Notice Minimalis */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-mbell-muted gap-2 pt-2 border-t border-mbell-border/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Katalog sinkron otomatis dengan sistem MBell Invitations</span>
          </div>
          <div className="italic text-[11px] text-mbell-muted/80">
            * Geser ke samping untuk melihat inspirasi template lainnya
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL ENLARGED DETAIL (PORTAL KE DOCUMENT.BODY) */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedPreview && (
            <motion.div
              key="invitation-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={() => setSelectedPreview(null)}
              className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                key={`modal-card-${selectedPreview.id}`}
                initial={{ scale: 0.94, opacity: 0, y: 14 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 14 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[90vh] bg-mbell-canvas rounded-2xl shadow-2xl border border-mbell-border overflow-hidden flex flex-col md:flex-row transform-gpu will-change-transform"
              >
                {/* Tombol Tutup Silang */}
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  aria-label="Tutup preview"
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-mbell-canvas/90 text-mbell-ink border border-mbell-border flex items-center justify-center hover:bg-mbell-surface transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Sisi Kiri: Mockup Smartphone Zoom */}
                <div className="w-full md:w-1/2 bg-gradient-to-b from-mbell-surface to-mbell-canvas flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-mbell-border overflow-hidden">
                  <div className="relative max-w-[240px] sm:max-w-[260px] w-full min-h-[260px] rounded-2xl overflow-hidden shadow-xl border border-mbell-border bg-mbell-canvas flex items-center justify-center">
                    <img
                      src={selectedPreview.mockup_url || selectedPreview.thumbnail_url}
                      alt={selectedPreview.name}
                      onError={handleImageError}
                      loading="eager"
                      decoding="async"
                      className="w-full h-auto object-cover max-h-[50vh] md:max-h-[65vh]"
                    />
                  </div>
                </div>

                {/* Sisi Kanan: Detail Template Murni dari Record DB */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-mbell-blush/60 text-mbell-primary font-sans text-xs font-semibold">
                        {selectedPreview.preview_badge || (selectedPreview.category === 'adat' ? 'Adat Nusantara' : 'Modern & Editorial')}
                      </span>
                      <span className="text-xs text-mbell-muted uppercase tracking-wider font-medium">
                        {selectedPreview.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-mbell-ink mb-3 tracking-tight">
                      {selectedPreview.name}
                    </h3>

                    <div className="w-10 h-[2px] bg-mbell-rose mb-4" />

                    <p className="font-sans text-xs sm:text-sm text-mbell-muted leading-relaxed mb-6">
                      {selectedPreview.description || 'Desain undangan digital terkurasi khusus untuk melengkapi hari istimewa Anda.'}
                    </p>

                    {/* Info Harga Dinamis */}
                    <div className="p-4 rounded-xl bg-mbell-surface border border-mbell-border mb-6">
                      <div className="text-[11px] font-sans text-mbell-muted uppercase tracking-wider mb-1">
                        Harga Spesial Promo Bundling
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-semibold text-mbell-primary">
                          {formatCurrency(selectedPreview.price)}
                        </span>
                        {selectedPreview.original_price && selectedPreview.original_price > (selectedPreview.price || 0) && (
                          <span className="font-sans text-xs text-mbell-muted/70 line-through">
                            {formatCurrency(selectedPreview.original_price)}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[11px] text-mbell-muted/80 mt-1">
                        * Pembayaran 1x untuk seumur hidup, tanpa batasan jumlah tamu undangan.
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-mbell-border">
                    <a
                      href={INVITATIONS_WEB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[42px] rounded-full bg-mbell-primary text-mbell-canvas font-sans text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-mbell-ink transition-colors shadow-xs"
                    >
                      <span>Pilih Template di Web</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                    
                    <button
                      type="button"
                      onClick={() => handleConsultWhatsApp(selectedPreview.name)}
                      className="min-h-[42px] px-5 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-sans text-xs sm:text-sm font-medium hover:bg-mbell-blush/60 transition-colors"
                    >
                      Tanya WA
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default InvitationsShowcase;
