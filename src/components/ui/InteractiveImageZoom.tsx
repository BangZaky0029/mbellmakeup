import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Hand } from 'lucide-react';

interface InteractiveImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  maxHeight?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover';
  onError?: React.ReactEventHandler<HTMLImageElement>;
  badge?: string;
}

export const CLOSE_BACKDROP_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='rgba(20,15,15,0.78)' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M11 11L21 21M21 11L11 21' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 16 16, pointer`;

const ZOOM_STEPS = [1, 1.8, 2.6, 3.4];
const MAX_ZOOM = 3.4;

export const InteractiveImageZoom: React.FC<InteractiveImageZoomProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  maxHeight,
  objectFit = 'contain',
  onError,
  badge
}) => {
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTapRef = useRef<number>(0);

  const dragStartRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const touchStartRef = useRef<{
    distance: number;
    scale: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  // Reset zoom when image src changes
  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIsSpacePressed(false);
    setIsDragging(false);
  }, [src]);

  // Clamp pan position to container bounds
  const clampPan = useCallback(
    (newPan: { x: number; y: number }, currentScale: number) => {
      if (!containerRef.current || currentScale <= 1) {
        return { x: 0, y: 0 };
      }
      const { clientWidth, clientHeight } = containerRef.current;
      const maxX = Math.max(0, (clientWidth * (currentScale - 1)) / 2 + 50);
      const maxY = Math.max(0, (clientHeight * (currentScale - 1)) / 2 + 50);

      return {
        x: Math.max(-maxX, Math.min(maxX, newPan.x)),
        y: Math.max(-maxY, Math.min(maxY, newPan.y))
      };
    },
    []
  );

  // Global Keyboard listener for Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Prevent scroll when interacting with zoomable popup
        e.preventDefault();
        setIsSpacePressed(true);
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
  }, []);

  // Step zoom handler
  const handleStepZoom = (clientX?: number, clientY?: number) => {
    const currentIndex = ZOOM_STEPS.findIndex((s) => Math.abs(s - scale) < 0.1);

    // If at MAX_ZOOM, reset to 1x
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

  // Reset zoom
  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse drag & pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

    if (!wasMoved && !isSpacePressed) {
      handleStepZoom(e.clientX, e.clientY);
    }
  };

  // Mobile Touch handlers (Pinch to Zoom, 1-finger pan, double-tap)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
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
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
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

  // Dynamic cursor calculation
  const getCursorClass = () => {
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

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ maxHeight }}
      className={`relative w-full h-full overflow-hidden select-none touch-none flex items-center justify-center ${getCursorClass()} ${containerClassName}`}
    >
      {/* Category or Status Badge (Only when provided) */}
      {badge && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-medium text-white border border-white/15 shadow-sm">
          {badge}
        </div>
      )}

      {/* The Zoomable & Pannable Image Element */}
      <div
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center center'
        }}
        className="w-full h-full flex items-center justify-center will-change-transform select-none"
      >
        <img
          src={src}
          alt={alt}
          onError={onError}
          draggable={false}
          className={`select-none pointer-events-none transition-none ${
            objectFit === 'cover' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'
          } ${className}`}
        />
      </div>

      {/* Space Key Hand-Pan Indicator (ONLY on Desktop and ONLY when Space key is actively held) */}
      {isSpacePressed && (
        <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-sans text-amber-300 border border-white/20 items-center gap-1.5 shadow-lg animate-pulse z-20">
          <Hand size={12} />
          <span>Mode Tangan: Geser mouse untuk memindahkan</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveImageZoom;
