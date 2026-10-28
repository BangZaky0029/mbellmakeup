import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from '../types';

interface TestimonialCardProps {
  item: Testimonial;
  index: number;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return null;
  }
};

const getInitials = (name: string) => {
  if (!name) return 'MB';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const formattedDate = formatDate(item.created_at);
  const initials = getInitials(item.name);
  const hasPhoto = Boolean(item.image_url);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <div className="w-[280px] sm:w-[380px] md:w-[440px] flex-shrink-0 snap-start">
      <div className="bg-mbell-canvas border border-mbell-border rounded-2xl p-6 md:p-7 shadow-[0_4px_20px_rgba(42,33,33,0.03)] h-full flex flex-col justify-between text-left transition-all duration-300">
        
        {/* Rating Stars & Date */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill={i < (item.rating || 5) ? "#F59E0B" : "none"} 
                  stroke={i < (item.rating || 5) ? "#F59E0B" : "#E6D7D2"}
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>

            {formattedDate && (
              <span className="text-[11px] font-sans text-mbell-muted">
                {formattedDate}
              </span>
            )}
          </div>

          {/* Testimonial Quote (Scrollable with custom scrollbar so no text is truncated) */}
          <div className="relative mb-5 group/quote">
            <div className="max-h-[110px] sm:max-h-[125px] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 scroll-smooth text-left">
              <p className="font-sans text-sm md:text-base text-mbell-ink leading-relaxed">
                "{item.content}"
              </p>
            </div>
            {/* Subtle bottom fade hint if text is long */}
            {item.content.length > 130 && (
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-mbell-canvas to-transparent opacity-60 group-hover/quote:opacity-0 transition-opacity" />
            )}
          </div>
        </div>

        {/* Bottom Section: Client Profile & Photo Dropdown */}
        <div className="pt-4 border-t border-mbell-border/80">
          
          {/* Client Profile Row (Interactive if photo is available) */}
          <div 
            onClick={() => hasPhoto && setIsPhotoOpen(!isPhotoOpen)}
            className={`flex items-center justify-between ${hasPhoto ? 'cursor-pointer group' : ''}`}
          >
            <div className="flex items-center gap-3">
              {/* Initials Monogram Avatar (Default photo is hidden) */}
              <div className="w-10 h-10 rounded-full bg-mbell-surface border border-mbell-border/90 shrink-0 flex items-center justify-center font-serif text-xs sm:text-sm font-medium text-mbell-primary shadow-xs select-none transition-transform group-hover:scale-105">
                {initials}
              </div>
              
              <div>
                <h4 className="font-serif text-base font-medium text-mbell-ink leading-tight group-hover:text-mbell-primary transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-sans text-mbell-muted">
                    {item.role || 'Klien Bahagia'}
                  </span>
                  {hasPhoto && (
                    <span className="inline-flex items-center text-[10px] text-mbell-primary font-sans bg-mbell-surface border border-mbell-border/60 px-1.5 py-0.2 rounded-full">
                      Foto 📷
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Toggle Indicator */}
            {hasPhoto && (
              <motion.div
                animate={{ rotate: isPhotoOpen ? 180 : 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="w-7 h-7 rounded-full bg-mbell-surface/80 border border-mbell-border/60 flex items-center justify-center text-mbell-muted group-hover:text-mbell-ink transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            )}
          </div>

          {/* Photo Accordion Dropdown (Drops down smoothly on click) */}
          {hasPhoto && (
            <>
              {/* Dropdown Toggle Trigger Button */}
              <button
                type="button"
                onClick={() => setIsPhotoOpen(!isPhotoOpen)}
                aria-expanded={isPhotoOpen}
                className="w-full mt-3 pt-2.5 flex items-center justify-between text-xs font-sans font-medium text-mbell-primary hover:text-mbell-ink transition-colors group select-none border-t border-mbell-border/50"
              >
                <span className="flex items-center gap-1.5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="13" 
                    height="13" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-mbell-rose transition-transform group-hover:scale-110"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>{isPhotoOpen ? 'Tutup Foto Hasil Riasan' : 'Lihat Foto Hasil Riasan'}</span>
                </span>
                
                <span className="text-[11px] font-sans text-mbell-muted group-hover:text-mbell-ink transition-colors">
                  {isPhotoOpen ? 'Tutup' : 'Buka'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isPhotoOpen && (
                  <motion.div
                    key="photo-dropdown-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const },
                        opacity: { duration: 0.28, delay: 0.08 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
                        opacity: { duration: 0.16 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      {/* Clickable Image Box with Zoom Indicator */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLightboxOpen(true);
                        }}
                        className="relative rounded-xl overflow-hidden border border-mbell-border/80 bg-mbell-surface shadow-xs group cursor-zoom-in"
                        title="Klik untuk melihat foto lebih besar"
                      >
                        <img 
                          src={item.image_url} 
                          alt={`Dokumentasi riasan ${item.name}`} 
                          loading="lazy" 
                          className="w-full h-48 sm:h-56 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />

                        {/* Subtle Zoom Badge on Hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-mbell-ink font-sans text-xs font-medium shadow-md backdrop-blur-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mbell-primary">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="11" y1="8" x2="11" y2="14"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            Klik untuk Perbesar
                          </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2.5 flex items-center justify-between text-white pointer-events-none">
                          <span className="text-[11px] font-sans font-medium tracking-wide">
                            {item.role || 'Hasil Riasan MBell'}
                          </span>
                          <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-sans flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <polyline points="9 21 3 21 3 15"></polyline>
                              <line x1="21" y1="3" x2="14" y2="10"></line>
                              <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                            Lihat Besar
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

        </div>

      </div>

      {/* Lightbox Modal: View Enlarged Photo Right There */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            key="testimonial-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Tutup foto"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-mbell-canvas rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
            >
              {/* Photo Viewport */}
              <div className="relative bg-[#1A1515] flex items-center justify-center overflow-hidden min-h-[260px] max-h-[62vh] sm:max-h-[66vh]">
                <img
                  src={item.image_url}
                  alt={`Dokumentasi riasan ${item.name}`}
                  className="w-full h-full object-contain max-h-[62vh] sm:max-h-[66vh]"
                />
              </div>

              {/* Info & Testimonial Quote */}
              <div className="p-4 sm:p-6 bg-mbell-canvas border-t border-mbell-border/80 flex flex-col gap-2.5 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-mbell-ink leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs font-sans text-mbell-muted mt-0.5">
                      {item.role || 'Klien Bahagia MBell MakeUp'}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="15" 
                        height="15" 
                        viewBox="0 0 24 24" 
                        fill={i < (item.rating || 5) ? "#F59E0B" : "none"} 
                        stroke={i < (item.rating || 5) ? "#F59E0B" : "#E6D7D2"}
                        strokeWidth="1.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Scrollable Full Quote */}
                <div className="max-h-[120px] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 border-t border-mbell-border/60 pt-2.5">
                  <p className="font-sans text-xs sm:text-sm text-mbell-ink/90 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default TestimonialCard;