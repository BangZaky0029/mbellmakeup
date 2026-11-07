import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RandomTextReveal from './ui/RandomTextReveal';

const DEFAULT_HERO_IMAGE =
  'https://fsbvnkwxwvffghrdxnxr.supabase.co/storage/v1/object/public/images_mbell/heroImages/foto_1_opt.jpeg';
const DEFAULT_SK_IMAGE =
  'https://fsbvnkwxwvffghrdxnxr.supabase.co/storage/v1/object/public/images_mbell/catalogue/S&K.jpeg';

interface HeroProps {
  onExploreClick?: () => void;
  onBookingClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookingClick }) => {
  const [heroData, setHeroData] = useState<{
    image_url: string;
    subtitle?: string;
    alt_text?: string;
  }>({
    image_url: DEFAULT_HERO_IMAGE,
    subtitle: 'Certified MUA',
    alt_text: 'Hasil riasan profesional oleh MBell MakeUp',
  });

  const [skThumbnailUrl, setSkThumbnailUrl] = useState<string>(DEFAULT_SK_IMAGE);

  // Fetch Hero Main image & S&K Flyer thumbnail dynamically from Supabase
  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      try {
        const { data } = await supabase
          .from('hero_images')
          .select('image_url, subtitle, alt_text')
          .eq('key', 'hero_main')
          .eq('is_active', true)
          .maybeSingle();

        if (data?.image_url && isMounted) {
          setHeroData({
            image_url: data.image_url,
            subtitle: data.subtitle || 'Certified MUA',
            alt_text: data.alt_text || 'Hasil riasan profesional oleh MBell MakeUp',
          });
        }
      } catch (err) {
        console.warn('Gagal memuat foto hero dari Supabase:', err);
      }
    };

    const fetchSKThumbnail = async () => {
      try {
        const { data } = await supabase
          .from('catalogue')
          .select('image_url')
          .ilike('label', '%Syarat%')
          .maybeSingle();

        if (data?.image_url && isMounted) {
          setSkThumbnailUrl(data.image_url);
        }
      } catch (err) {
        console.warn('Gagal memuat flyer S&K hero dari Supabase:', err);
      }
    };

    fetchHeroData();
    fetchSKThumbnail();

    // Supabase Realtime Subscription untuk update instan
    const channel = supabase
      .channel('hero_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_images' },
        () => {
          fetchHeroData();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);
  const scrollTo = (targetId: string, customCallback?: () => void) => {
    if (customCallback) {
      customCallback();
      return;
    }
    const element = document.getElementById(targetId);
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
    <section id="home" className="relative bg-mbell-canvas text-mbell-ink pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-mbell-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Kolom Visual: Tampil di atas pada Mobile, di kanan pada Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 lg:order-2 relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            {/* Main Portrait with Organic Arch */}
            <div className="relative aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden border border-mbell-border bg-mbell-surface shadow-[0_20px_50px_rgba(200,138,130,0.15)]">
              <img
                src={heroData.image_url}
                alt={heroData.alt_text || "Hasil riasan profesional oleh MBell MakeUp"}
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mbell-ink/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Thumbnail Pendukung (Flyer Syarat & Ketentuan dari Tabel Catalogue) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden sm:block absolute -bottom-5 -left-6 w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-mbell-canvas bg-mbell-surface shadow-xl cursor-pointer group"
              onClick={() => scrollTo('pricelist', onExploreClick)}
              title="Lihat Syarat & Ketentuan di Pricelist"
            >
              <img
                src={skThumbnailUrl}
                alt="Syarat & Ketentuan MBell MakeUp"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>

            {/* Subtle Signature Badge */}
            <div className="absolute top-4 right-4 bg-mbell-canvas/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-mbell-border shadow-sm text-[11px] font-sans font-medium text-mbell-muted">
              {heroData.subtitle || 'Certified MUA'}
            </div>
          </motion.div>

          {/* Kolom Teks & Aksi: Rata kiri, bersih, dan ramah dibaca */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 lg:order-1 text-left"
          >

            <RandomTextReveal
              as="h1"
              text="Sentuhan riasan personal untuk momen paling berkesanmu."
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] tracking-tight text-mbell-ink mb-6"
              delayBase={0.12}
            />

            <p className="font-sans text-base sm:text-lg text-mbell-muted leading-relaxed max-w-[58ch] mb-8">
              Mulai dari prosesi akad, resepsi pernikahan, hingga wisuda dan momen istimewa lainnya. Kami merancang tampilan yang menyatu alami dengan karakter wajahmu dan nyaman bertahan sepanjang hari.
            </p>

            {/* Tombol Aksi: Full-width di layar HP kecil, berdampingan di layar besar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => scrollTo('contact', onBookingClick)}
                className="inline-flex justify-center items-center min-h-[48px] px-7 py-3.5 rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-sm transition-all hover:bg-mbell-ink shadow-[0_4px_14px_rgba(158,90,84,0.25)] focus:outline-none focus:ring-2 focus:ring-mbell-rose focus:ring-offset-2 active:scale-98"
              >
                Cek Jadwal & Pesan
              </button>
              <button
                type="button"
                onClick={() => scrollTo('pricelist', onExploreClick)}
                className="inline-flex justify-center items-center min-h-[48px] px-7 py-3.5 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-sans font-medium text-sm transition-colors hover:bg-mbell-blush/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose focus:ring-offset-2 active:scale-98"
              >
                Lihat Daftar Paket
              </button>
            </div>

            {/* Features Row */}
            <div className="mt-10 pt-8 border-t border-mbell-border grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">5+ Thn</p>
                <p className="font-sans text-xs text-mbell-muted mt-0.5">Pengalaman MUA</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">Natural</p>
                <p className="font-sans text-xs text-mbell-muted mt-0.5">Complexion Flawless</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-medium text-mbell-ink">Halal</p>
                <p className="font-sans text-xs text-mbell-muted mt-0.5">Produk Terkurasi</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;