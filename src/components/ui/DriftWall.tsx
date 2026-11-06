'use client';

import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface DriftWallItem {
    image: string;
    title?: string;
    href?: string;
    category?: string;
    description?: string;
    rawItem?: any;
}

export interface DriftWallProps {
    items?: DriftWallItem[];
    columns?: number;
    tileWidth?: number;
    tileHeight?: number;
    gap?: number;
    radius?: number;
    tilt?: number;
    turn?: number;
    roll?: number;
    perspective?: number;
    depth?: number;
    speed?: number;
    direction?: 'up' | 'down';
    variance?: number;
    parallax?: number;
    pauseOnHover?: boolean;
    lift?: number;
    fade?: number;
    dim?: number;
    grayscale?: boolean;
    overlayColor?: string;
    className?: string;
    style?: CSSProperties;
    onItemClick?: (item: DriftWallItem) => void;
}

interface ColumnMeta {
    copyHeight: number;
    copies: number;
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
    const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
    return {
        image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
        title: `Look Makeup ${i + 1}`,
        href: undefined
    };
});

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
    const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
    return 1 + variance * pseudo;
};

const DriftWall = ({
    items = DEFAULT_ITEMS,
    columns = 4,
    tileWidth = 180,
    tileHeight = 240,
    gap = 16,
    radius = 16,
    tilt = 14,
    turn = -12,
    roll = 0,
    perspective = 1100,
    depth = 90,
    speed = 34,
    direction = 'up',
    variance = 0.45,
    parallax = 0.5,
    pauseOnHover = true,
    lift = 50,
    fade = 0.55,
    dim = 0.65,
    grayscale = false,
    overlayColor = '#2A2121',
    className = '',
    style,
    onItemClick
}: DriftWallProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const planeRef = useRef<HTMLDivElement>(null);
    const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number | null>(null);

    const offsetsRef = useRef<number[]>([]);
    const velocitiesRef = useRef<number[]>([]);
    const hoveredColRef = useRef<number>(-1);
    const wallHoveredRef = useRef<boolean>(false);
    const pointerRef = useRef({ x: 0, y: 0 });
    const pointerDampedRef = useRef({ x: 0, y: 0 });
    const lastTsRef = useRef<number | null>(null);

    // Scroll stack & dragging refs
    const manualDeltaRef = useRef<number>(0);
    const isDraggingWallRef = useRef<boolean>(false);
    const dragStartYRef = useRef<number>(0);
    const dragMovedRef = useRef<boolean>(false);

    const [containerHeight, setContainerHeight] = useState(600);
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeIdRef = useRef<string | null>(null);
    const [reduced, setReduced] = useState(false);
    const [isInView, setIsInView] = useState(true);

    // Viewport IntersectionObserver to optimize performance (pause animation when scrolled away)
    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setReduced(prefersReducedMotion());
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const columnItems = useMemo<DriftWallItem[][]>(() => {
        if (!items || items.length === 0) return Array.from({ length: columns }, () => []);
        
        // Loop items if count is small so all columns have continuous flow
        let pool = [...items];
        while (pool.length < Math.max(columns * 3, 12)) {
            pool = [...pool, ...items];
        }

        const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
        pool.forEach((item, i) => cols[i % columns].push(item));
        return cols.map(col => (col.length ? col : items.slice(0, 1)));
    }, [items, columns]);

    const columnMeta = useMemo<ColumnMeta[]>(() => {
        const unit = tileHeight + gap;
        return columnItems.map(col => {
            const copyHeight = Math.max(unit, col.length * unit);
            const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
            return { copyHeight, copies };
        });
    }, [columnItems, tileHeight, gap, containerHeight]);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerHeight(entry.contentRect.height || 600);
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const baseVelocities = useMemo<number[]>(() => {
        const dirSign = direction === 'up' ? 1 : -1;
        return columnItems.map((_, c) => {
            const altSign = c % 2 === 0 ? 1 : -1;
            return speed * columnFactor(c, variance) * dirSign * altSign;
        });
    }, [columnItems, speed, direction, variance]);

    useEffect(() => {
        offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
        velocitiesRef.current = columnItems.map(() => 0);
    }, [columnMeta, columnItems]);

    // Isolated wheel scrolling on the photos (prevents page from scrolling)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const delta = e.deltaMode === 1 ? e.deltaY * 22 : e.deltaY;
            // Negative delta means scrolling up, positive delta means scrolling down
            manualDeltaRef.current += delta * 1.35;
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const applyPlaneTransform = useCallback(
        (px: number, py: number) => {
            const plane = planeRef.current;
            if (!plane) return;
            plane.style.transform =
                `translate(-50%, -50%) scale(1.15) ` +
                `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
                `translateZ(${-depth}px)`;
        },
        [tilt, turn, roll, depth]
    );

    useEffect(() => {
        if (!isInView) {
            // Suspend animation loop when out of viewport for ultra-lightweight performance
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastTsRef.current = null;
            return;
        }

        const animate = (ts: number) => {
            if (lastTsRef.current === null) lastTsRef.current = ts;
            const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
            lastTsRef.current = ts;

            // Parallax smoothing
            const maxTilt = parallax * 8;
            const targetX = pointerRef.current.x * maxTilt;
            const targetY = -pointerRef.current.y * maxTilt;
            const damp = 1 - Math.exp(-dt / 0.12);
            pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
            pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
            applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

            // Handle manual wheel scroll / drag inertia on the photos
            let manualStep = 0;
            if (Math.abs(manualDeltaRef.current) > 0.05) {
                manualStep = manualDeltaRef.current * 0.22;
                manualDeltaRef.current -= manualStep;
            } else {
                manualDeltaRef.current = 0;
            }

            if (!reduced) {
                for (let c = 0; c < trackRefs.current.length; c++) {
                    const meta = columnMeta[c];
                    if (!meta) continue;
                    const paused = wallHoveredRef.current && pauseOnHover;
                    const factor = paused || hoveredColRef.current === c ? 0 : 1;
                    const target = baseVelocities[c] * factor;

                    const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
                    velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
                    
                    let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt + manualStep;
                    next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
                    offsetsRef.current[c] = next;

                    const el = trackRefs.current[c];
                    if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
                }
            } else {
                for (let c = 0; c < trackRefs.current.length; c++) {
                    const el = trackRefs.current[c];
                    const meta = columnMeta[c];
                    if (el && meta) {
                        let next = (offsetsRef.current[c] ?? 0) + manualStep;
                        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
                        offsetsRef.current[c] = next;
                        el.style.transform = `translate3d(0, ${-next}px, 0)`;
                    }
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastTsRef.current = null;
        };
    }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, isInView, applyPlaneTransform]);

    const activate = useCallback((id: string, index: number): void => {
        activeIdRef.current = id;
        hoveredColRef.current = index;
        setActiveId(id);
    }, []);

    const release = useCallback((): void => {
        activeIdRef.current = null;
        hoveredColRef.current = -1;
        setActiveId(null);
    }, []);

    // Pointer events with Drag-to-scroll support
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingWallRef.current = true;
        dragStartYRef.current = e.clientY;
        dragMovedRef.current = false;
    }, []);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            // Dragging vertical scroll
            if (isDraggingWallRef.current) {
                const dy = e.clientY - dragStartYRef.current;
                if (Math.abs(dy) > 4) {
                    dragMovedRef.current = true;
                    manualDeltaRef.current -= dy * 0.9;
                    dragStartYRef.current = e.clientY;
                }
            }

            // Parallax calculations
            if (parallax > 0 && !reduced) {
                pointerRef.current = {
                    x: (e.clientX - rect.left) / rect.width - 0.5,
                    y: (e.clientY - rect.top) / rect.height - 0.5
                };
            }

            // Tile hover detection
            const hit = document.elementFromPoint(e.clientX, e.clientY);
            const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
            if (!tile) return;
            const id = tile.dataset.tileId ?? null;
            if (id === activeIdRef.current) return;
            activeIdRef.current = id;
            hoveredColRef.current = Number(tile.dataset.col);
            setActiveId(id);
        },
        [parallax, reduced]
    );

    const handlePointerUp = useCallback(() => {
        isDraggingWallRef.current = false;
    }, []);

    const handlePointerLeaveWall = useCallback((): void => {
        isDraggingWallRef.current = false;
        wallHoveredRef.current = false;
        pointerRef.current = { x: 0, y: 0 };
        release();
    }, [release]);

    const maskStyle =
        'radial-gradient(ellipse 84% 86% at 50% 50%, #000 var(--dw-edge), transparent 100%), ' +
        'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)';

    const cssVars = useMemo<CSSProperties>(
        () =>
            ({
                '--dw-tile-w': `${tileWidth}px`,
                '--dw-tile-h': `${tileHeight}px`,
                '--dw-gap': `${gap}px`,
                '--dw-radius': `${radius}px`,
                '--dw-lift': `${lift}px`,
                '--dw-dim': dim,
                '--dw-gray': grayscale ? 1 : 0,
                '--dw-overlay': overlayColor,
                '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
                perspective: `${perspective}px`,
                perspectiveOrigin: '50% 50%',
                WebkitMaskImage: maskStyle,
                maskImage: maskStyle,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                ...style
            }) as CSSProperties,
        [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective, maskStyle, style]
    );

    const tileClass = cx(
        'group/tile relative block flex-none cursor-pointer outline-none [backface-visibility:hidden]',
        'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]'
    );
    const innerClass = cx(
        'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-mbell-surface',
        'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]',
        'border border-mbell-border/40 [backface-visibility:hidden]',
        'transition-[transform,opacity,box-shadow] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]',
        'group-[.is-active]/tile:shadow-[0_24px_50px_-14px_rgba(42,33,33,0.45)] group-[.is-active]/tile:border-mbell-rose/60',
        'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]',
        'group-focus-visible/tile:shadow-[0_24px_50px_-14px_rgba(42,33,33,0.45),0_0_0_2px_rgba(158,90,84,0.9)]'
    );
    const imgClass = cx(
        'block h-full w-full select-none object-cover [backface-visibility:hidden]',
        '[filter:grayscale(var(--dw-gray))_saturate(0.95)]',
        'transition-[filter,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.08)] group-[.is-active]/tile:scale-105 group-focus-visible/tile:[filter:grayscale(0)_saturate(1.08)]'
    );
    const overlayClass = cx(
        'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.22]',
        'transition-opacity duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0'
    );

    const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
        const inner = (
            <span className={innerClass}>
                <img
                    src={item.image}
                    alt={item.title ?? 'Look Mbell MakeUp'}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={imgClass}
                />
                <span className={overlayClass} aria-hidden="true" />

                {/* Subtle Overlay Badge on Hover */}
                {(item.title || item.category) && (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-[.is-active]/tile:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-left">
                        {item.category && (
                            <span className="text-[9px] font-sans font-semibold uppercase tracking-wider text-mbell-rose mb-0.5">
                                {item.category}
                            </span>
                        )}
                        {item.title && (
                            <span className="font-serif text-xs sm:text-sm font-medium text-white line-clamp-1 drop-shadow-sm">
                                {item.title}
                            </span>
                        )}
                    </span>
                )}
            </span>
        );

        const handleClick = (e: React.MouseEvent) => {
            // Ignore click if user was dragging/scrolling the wall
            if (dragMovedRef.current) {
                e.preventDefault();
                return;
            }
            if (onItemClick) {
                e.preventDefault();
                onItemClick(item);
            }
        };

        const commonProps = {
            className: cx(tileClass, activeId === id && 'is-active'),
            'data-tile-id': id,
            'data-col': colIndex,
            onFocus: () => activate(id, colIndex),
            onBlur: release,
            onClick: handleClick
        };

        if (item.href && !onItemClick) {
            return (
                <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
                    {inner}
                </a>
            );
        }
        return (
            <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'Koleksi Portofolio'} {...commonProps}>
                {inner}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            data-scroll-isolated="true"
            className={cx('relative h-full w-full overflow-hidden select-none [overscroll-behavior:contain] [touch-action:none]', className)}
            style={cssVars}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerEnter={() => {
                wallHoveredRef.current = true;
            }}
            onPointerLeave={handlePointerLeaveWall}
            role="region"
            aria-label="Galeri Foto Berjalan 3D"
        >
            <div
                ref={planeRef}
                className="absolute left-1/2 top-1/2 flex cursor-grab active:cursor-grabbing flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
            >
                {columnItems.map((col, c) => {
                    const meta = columnMeta[c];
                    if (!meta) return null;
                    const copies = Array.from({ length: meta.copies });
                    return (
                        <div
                            className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
                            key={`col-${c}`}
                        >
                            <div
                                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                                ref={el => {
                                    trackRefs.current[c] = el;
                                }}
                            >
                                {copies.map((_, copyIndex) =>
                                    col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DriftWall;
