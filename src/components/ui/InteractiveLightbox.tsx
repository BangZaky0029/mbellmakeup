import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand
} from 'lucide-react';

export interface LightboxItem {
  id: string;
  label: string;
  shortTitle: string;
  image: string;
  desc?: string;
  badge?: string;
  waQuery?: string;
}

interface InteractiveLightboxProps<T extends LightboxItem = LightboxItem> {
  item: T | null;
  onClose: () => void;
  onDownload?: (item: T) => void;
  onWhatsApp?: (item: T) => void;
}

// 4 distinct zoom steps from fit (1x) to ultra-detailed view (3.4x)
const ZOOM_STEPS = [1, 1.8, 2.6, 3.4];
const MAX_ZOOM = 3.4;

// Custom SVG cursor "X" inside circle with drop-shadow for outside backdrop area
const CLOSE_BACKDROP_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='rgba(20,15,15,0.78)' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M11 11L21 21M21 11L11 21' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 16 16, pointer`;

export function InteractiveLightbox<T extends LightboxItem = LightboxItem>({
  item,
  onClose,
  onDownload,
  onWhatsApp
}: InteractiveLightboxProps<T>) {
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastTapRef = useRef<number>(0);

  // Drag tracking refs
  const dragStartRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  // Touch tracking ref for pinch & pan
  const touchStartRef = useRef<{
    distance: number;
    scale: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  // Reset scale and pan whenever a new item is opened
  useEffect(() => {
    if (item) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      setIsSpacePressed(false);
      setIsDragging(false);
    }
  }, [item]);

  // Lock body scroll while lightbox is active
  useEffect(() => {
    if (!item) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [item]);

  // Clamp pan position so image stays comfortably visible
  const clampPan = useCallback(
    (newPan: { x: number; y: number }, currentScale: number) => {
      if (!containerRef.current || currentScale <= 1) {
        return { x: 0, y: 0 };
      }
      const { clientWidth, clientHeight } = containerRef.current;
      const maxX = Math.max(0, (clientWidth * (currentScale - 1)) / 2 + 60);
      const maxY = Math.max(0, (clientHeight * (currentScale - 1)) / 2 + 60);

      return {
        x: Math.max(-maxX, Math.min(maxX, newPan.x)),
        y: Math.max(-maxY, Math.min(maxY, newPan.y))
      };
    },
    []
  );

  // Global Keyboard Listeners: Space (hand pan) & Escape (exit)
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Prevent default browser page scroll
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [item, onClose]);

  // Zoom In / Zoom Out step click handler
  const handleStepZoom = (clientX?: number, clientY?: number) => {
    const currentIndex = ZOOM_STEPS.findIndex((s) => Math.abs(s - scale) < 0.1);

    // If currently at MAX_ZOOM, reset back to 1x
    if (currentIndex >= ZOOM_STEPS.length - 1 || scale >= MAX_ZOOM) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const nextScale = ZOOM_STEPS[currentIndex + 1] || MAX_ZOOM;

    if (containerRef.current && clientX !== undefined && clientY !== undefined) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickOffsetX = clientX - rect.left - rect.width / 2;
      const clickOffsetY = clientY - rect.top - rect.height / 2;
      const ratio = (nextScale - scale) / scale;

      const newPan = {
        x: pan.x - clickOffsetX * ratio * 0.7,
        y: pan.y - clickOffsetY * ratio * 0.7
      };
      setScale(nextScale);
      setPan(clampPan(newPan, nextScale));
    } else {
      setScale(nextScale);
      setPan((prev) => clampPan(prev, nextScale));
    }
  };

  // Zoom Out by 1 step
  const handleZoomOutStep = () => {
    const currentIndex = ZOOM_STEPS.findIndex((s) => Math.abs(s - scale) < 0.1);
    if (currentIndex <= 0 || scale <= 1) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      return;
    }
    const prevScale = ZOOM_STEPS[currentIndex - 1] || 1;
    setScale(prevScale);
    setPan((prev) => clampPan(prev, prevScale));
  };

  // Reset Zoom
  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Handlers for Desktop Drag / Pan and Click-to-Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.hypot(dx, dy) > 3) {
      dragStartRef.current.moved = true;
    }

    // Allow panning if space is held OR if scale > 1
    if (isSpacePressed || scale > 1) {
      const rawNewPan = {
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy
      };
      setPan(clampPan(rawNewPan, scale));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const wasMoved = dragStartRef.current?.moved;
    setIsDragging(false);
    dragStartRef.current = null;

    // If mouse was clicked without dragging and Space is not pressed:
    if (!wasMoved && !isSpacePressed) {
      handleStepZoom(e.clientX, e.clientY);
    }
  };

  // Touch Handlers for Mobile (Pinch to Zoom, 1-Finger Pan, Double Tap)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2-Finger Pinch to Zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchStartRef.current = {
        distance: dist,
        scale: scale,
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
        panX: pan.x,
        panY: pan.y
      };
    } else if (e.touches.length === 1) {
      // Double-tap detector
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        // Toggle zoom
        if (scale > 1) {
          handleResetZoom();
        } else {
          const t = e.touches[0];
          setScale(2.2);
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const tapX = t.clientX - rect.left - rect.width / 2;
            const tapY = t.clientY - rect.top - rect.height / 2;
            setPan(clampPan({ x: -tapX * 0.7, y: -tapY * 0.7 }, 2.2));
          }
        }
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // 1-Finger Pan Start
      const t = e.touches[0];
      touchStartRef.current = {
        distance: 0,
        scale: scale,
        x: t.clientX,
        y: t.clientY,
        panX: pan.x,
        panY: pan.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (e.touches.length === 2) {
      // Pinching
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / (touchStartRef.current.distance || 1);
      const newScale = Math.min(Math.max(touchStartRef.current.scale * ratio, 1), 4);

      setScale(newScale);
      if (newScale <= 1) {
        setPan({ x: 0, y: 0 });
      } else {
        setPan((prev) => clampPan(prev, newScale));
      }
    } else if (e.touches.length === 1 && scale > 1) {
      // 1-Finger Pan
      const t = e.touches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const rawNewPan = {
        x: touchStartRef.current.panX + dx,
        y: touchStartRef.current.panY + dy
      };
      setPan(clampPan(rawNewPan, scale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      touchStartRef.current = null;
      if (scale < 1.05) {
        setScale(1);
        setPan({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartRef.current = {
        distance: 0,
        scale: scale,
        x: t.clientX,
        y: t.clientY,
        panX: pan.x,
        panY: pan.y
      };
    }
  };

  // Determine dynamic cursor style on the image viewport
  const getImageCursorClass = () => {
    if (isSpacePressed) {
      return isDragging ? 'cursor-grabbing' : 'cursor-grab';
    }
    if (scale > 1 && isDragging) {
      return 'cursor-grabbing';
    }
    if (scale >= MAX_ZOOM) {
      return 'cursor-zoom-out';
    }
    return 'cursor-zoom-in';
  };

  if (!item || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="interactive-lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ cursor: CLOSE_BACKDROP_CURSOR }}
        className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 select-none"
        onClick={onClose}
      >
        {/* Main Popup Modal Container (Resets cursor to default so inside area is normal) */}
        <motion.div
          key="interactive-lightbox-card"
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl w-full my-auto text-center cursor-default flex flex-col max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 px-1.5 shrink-0">
            <div className="flex items-center gap-2 text-left">
              <span className="text-sm sm:text-base font-sans font-semibold text-white drop-shadow-sm">
                {item.label}
              </span>
              <span className="text-[10px] sm:text-xs font-sans px-2.5 py-0.5 rounded-full bg-white/20 text-white font-medium border border-white/10">
                {item.shortTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls Indicator Bar (Compact) */}
              <div className="hidden sm:flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/15 text-white text-xs">
                <button
                  type="button"
                  onClick={handleZoomOutStep}
                  disabled={scale <= 1}
                  className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Perkecil (-)"
                  aria-label="Perkecil"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="px-1.5 font-mono text-[11px] font-semibold min-w-[42px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => handleStepZoom()}
                  disabled={scale >= MAX_ZOOM}
                  className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Perbesar (+)"
                  aria-label="Perbesar"
                >
                  <ZoomIn size={13} />
                </button>
                {scale > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1 ml-0.5 rounded-full hover:bg-white/20 text-mbell-rose transition-colors"
                    title="Reset Ukuran Normal"
                    aria-label="Reset Ukuran Normal"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>

              {onDownload && (
                <button
                  type="button"
                  onClick={() => onDownload(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium backdrop-blur-md transition-colors border border-white/10 shadow-sm"
                  title="Download Gambar Brosur"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-medium backdrop-blur-md transition-colors border border-white/10 shadow-sm"
                title="Tutup (Esc)"
              >
                <X size={14} />
                <span className="hidden sm:inline">Tutup</span>
              </button>
            </div>
          </div>

          {/* Interactive Image Viewport Canvas */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden rounded-2xl bg-[#FCF9F6] p-2 sm:p-3 shadow-2xl border border-white/15 max-h-[72vh] flex items-center justify-center touch-none ${getImageCursorClass()}`}
          >
            {/* The Zoomable & Pannable Image Layer */}
            <div
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: 'center center'
              }}
              className="will-change-transform max-w-full max-h-full flex items-center justify-center select-none"
            >
              <img
                ref={imageRef}
                src={item.image}
                alt={item.label}
                draggable={false}
                className="w-auto h-auto max-w-full max-h-[68vh] object-contain rounded-xl pointer-events-none select-none shadow-sm"
              />
            </div>

            {/* Space Key Hand-Pan Indicator (ONLY on Desktop when Space is held) */}
            {isSpacePressed && (
              <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-sans text-amber-300 border border-white/20 items-center gap-1.5 shadow-lg animate-pulse z-20">
                <Hand size={12} />
                <span>Mode Tangan: Geser kursor untuk memindahkan posisi</span>
              </div>
            )}
          </div>

          {/* Bottom WhatsApp Inquiry Button */}
          {onWhatsApp && (
            <div className="mt-3.5 flex justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onWhatsApp(item)}
                className="min-h-[42px] px-6 py-2 rounded-full bg-mbell-primary text-mbell-canvas font-sans text-xs font-semibold shadow-lg hover:bg-mbell-ink transition-colors flex items-center gap-2"
              >
                <MessageCircle size={15} />
                <span>Lanjut Booking via WhatsApp</span>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default InteractiveLightbox;
