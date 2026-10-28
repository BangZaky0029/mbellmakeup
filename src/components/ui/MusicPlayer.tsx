import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const musicSrc = '/music/sound_01.mp3';

  // Sinkronisasi volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle click outside to close volume slider on touch devices
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.log('Audio playback prevented:', e));
    }
  };

  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log('Audio loop failed:', e));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 left-5 z-40 flex items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio
        ref={audioRef}
        src={musicSrc}
        loop={true}
        autoPlay={true}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Volume Slider Panel */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-14 left-0 w-11 flex flex-col items-center bg-mbell-canvas/95 backdrop-blur-md rounded-2xl shadow-lg p-3 border border-mbell-border pb-3"
          >
            <div className="h-20 w-1 relative flex items-center justify-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-20 h-full -rotate-90 origin-center cursor-pointer opacity-0 z-10"
                title="Volume"
              />
              <div className="w-1 h-full bg-mbell-surface rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 w-full bg-mbell-primary transition-all"
                  style={{ height: `${volume * 100}%` }}
                />
              </div>
              <div
                className="absolute w-2.5 h-2.5 bg-mbell-primary rounded-full shadow pointer-events-none"
                style={{ bottom: `calc(${volume * 100}% - 5px)` }}
              />
            </div>
            <span className="mt-2 text-[9px] font-sans text-mbell-muted">
              {Math.round(volume * 100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Button Capsule */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        className={`
          relative min-h-[44px] px-3.5 py-2 rounded-full flex items-center gap-2.5
          shadow-[0_4px_16px_rgba(42,33,33,0.08)] border border-mbell-border backdrop-blur-md
          transition-all duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-mbell-rose
          ${isPlaying ? 'bg-mbell-primary text-mbell-canvas' : 'bg-mbell-canvas/90 text-mbell-ink hover:bg-mbell-surface'}
        `}
      >
        {isPlaying ? (
          <>
            {/* Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3.5">
              <div className="w-[2.5px] bg-mbell-canvas rounded-full eq-bar-1" />
              <div className="w-[2.5px] bg-mbell-canvas rounded-full eq-bar-2" />
              <div className="w-[2.5px] bg-mbell-canvas rounded-full eq-bar-3" />
              <div className="w-[2.5px] bg-mbell-canvas rounded-full eq-bar-4" />
            </div>
            <span className="text-[11px] font-sans font-medium hidden sm:inline-block">
              Musik
            </span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span className="text-[11px] font-sans font-medium hidden sm:inline-block">
              Putar
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
