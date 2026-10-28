import React, { useRef, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import RandomTextReveal from './ui/RandomTextReveal';

interface TestimonialsProps {
  onSeeFullGallery?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onSeeFullGallery }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSuccess = () => {
    fetchTestimonials();
    setShowForm(false);
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-mbell-canvas border-b border-mbell-border relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-10">

        {/* Header Seksi & Kontrol Panah */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="text-left max-w-xl">
            <RandomTextReveal
              as="h2"
              text="Cerita bahagia dari para klien."
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight"
              delayBase={0.1}
            />
            <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
              Kepuasan dan senyum percaya dirimu adalah pencapaian terbesar kami. Geser ke samping untuk membaca pengalaman mereka.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              aria-label="Geser ke kiri"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-mbell-surface border border-mbell-border text-mbell-ink flex items-center justify-center hover:bg-mbell-blush/60 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              type="button"
              aria-label="Geser ke kanan"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-mbell-surface border border-mbell-border text-mbell-ink flex items-center justify-center hover:bg-mbell-blush/60 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Snap Carousel Container */}
        <div
          ref={containerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 items-start"
        >
          {loading && testimonials.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[280px] sm:w-[380px] flex-shrink-0 animate-pulse">
                <div className="bg-mbell-surface rounded-2xl border border-mbell-border h-[220px] p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-mbell-border/60 rounded w-1/3"></div>
                    <div className="h-3 bg-mbell-border/60 rounded w-full"></div>
                    <div className="h-3 bg-mbell-border/60 rounded w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mbell-border/60"></div>
                    <div className="h-4 bg-mbell-border/60 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((item, index) => (
              <TestimonialCard key={item.id} item={item} index={index} />
            ))
          ) : (
            <div className="w-full text-center py-12 bg-mbell-surface rounded-2xl border border-mbell-border">
              <p className="font-serif text-xl text-mbell-muted italic">
                "Jadilah yang pertama menuliskan cerita bahagiamu bersama MBell MakeUp..." ✨
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSeeFullGallery}
            className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-sans font-medium text-xs sm:text-sm hover:bg-mbell-blush/60 transition-colors shadow-sm"
          >
            Lihat Semua Testimoni
          </button>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-xs sm:text-sm hover:bg-mbell-ink transition-colors shadow-sm"
          >
            {showForm ? 'Tutup Formulir Ulasan' : 'Tulis Ulasan Anda'}
          </button>
        </div>

        {/* Form Modal/Expansion */}
        {showForm && (
          <div className="mt-8 pt-8 border-t border-mbell-border">
            <TestimonialForm onSuccess={handleSuccess} />
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;