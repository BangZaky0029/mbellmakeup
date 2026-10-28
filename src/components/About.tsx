import React from 'react';
import { motion } from 'framer-motion';
import bellaProfile from '../assets/foto_2_opt.jpeg';
import RandomTextReveal from './ui/RandomTextReveal';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-mbell-surface/50 border-b border-mbell-border relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Kolom Visual Profil Bella */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-mbell-border bg-mbell-canvas shadow-[0_16px_40px_rgba(42,33,33,0.06)]">
              <img
                src={bellaProfile}
                alt="Bella Aprilian - Professional Makeup Artist"
                className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Signature Floating Card */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-4 bg-mbell-canvas border border-mbell-border rounded-2xl p-4 sm:p-5 shadow-lg max-w-[220px]">
              <p className="font-serif italic text-lg text-mbell-ink leading-tight">
                "Kecantikan alami adalah karakter terbaikmu."
              </p>
              <p className="font-sans text-[11px] text-mbell-primary font-medium mt-2">
                — Bella Aprilian
              </p>
            </div>
          </motion.div>

          {/* Kolom Narasi & Filosofi Riasan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 text-left"
          >

            <RandomTextReveal
              as="h2"
              text="Menghadirkan keanggunan sejati tanpa mengubah karakter dirimu."
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-6 leading-tight"
              delayBase={0.1}
            />

            <div className="font-sans text-mbell-muted text-base sm:text-lg leading-relaxed space-y-4 max-w-[62ch]">
              <p>
                Halo, saya <span className="font-medium text-mbell-ink">Bella Aprilian</span>, Founder & Lead Makeup Artist di MBell MakeUp. Berangkat dari kecintaan pada seni tata rias, fokus utama saya adalah merancang riasan yang menonjolkan fitur terbaik wajahmu secara elegan.
              </p>
              <p>
                Setiap orang memiliki jenis kulit dan warna dasar (*skin undertone*) yang berbeda. Kami hanya menggunakan produk-produk premium teruji dan teknik aplikasi modern agar riasan terasa ringan, tidak menyumbat pori, dan tetap *flawless* dari awal acara hingga selesai.
              </p>
              <p>
                Baik itu hari pernikahan yang sakral, wisuda yang penuh kebanggaan, maupun acara istimewa lainnya, MBell MakeUp siap menemani langkah bahagiamu dengan tenang dan percaya diri.
              </p>
            </div>

            {/* Keunggulan Layanan */}
            <div className="mt-8 pt-6 border-t border-mbell-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-primary shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-serif text-base text-mbell-ink font-medium">Ketahanan Seharian</h4>
                  <p className="font-sans text-xs text-mbell-muted mt-0.5">Teknik *skin-prep* mendalam untuk hasil riasan awet & anti-crack.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-primary shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-serif text-base text-mbell-ink font-medium">Higienitas Terjamin</h4>
                  <p className="font-sans text-xs text-mbell-muted mt-0.5">Peralatan kuas, spons, dan aplikator disterilisasi sebelum setiap sesi.</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;