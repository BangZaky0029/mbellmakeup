
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Menggunakan path audio .mp3 sesuai instruksi
  const musicSrc = '/music/sound_01.mp3';

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle click/touch outside to close volume/controls on mobile
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

  // Logic manual useEffect untuk autoplay ditiadakan sesuai request.
  // Gantinya menggunakan prop autoPlay pada elemen <audio> yang akan
  // berfungsi karena komponen ini dirender setelah interaksi user (klik "Enter Experience").

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  // Fungsi manual untuk memastikan loop terjadi jika atribut loop gagal
  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Loop replay failed:", e));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-[9999] flex items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
          1. 'loop': Atribut standar HTML5 agar musik berulang otomatis.
          2. 'autoPlay': Memulai musik otomatis saat komponen di-mount (setelah interaksi user di App.tsx).
          3. 'onPlay' & 'onPause': Sinkronisasi state isPlaying dengan status audio asli.
      */}
      <audio
        ref={audioRef}
        src={musicSrc}
        loop={true} 
        autoPlay={true}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Volume Slider Container */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="absolute bottom-14 left-0 w-12 flex flex-col items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg p-3 border border-white/50 pb-4"
          >
            <div className="h-24 w-1 relative flex items-center justify-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-24 h-full -rotate-90 origin-center cursor-pointer opacity-0 z-10"
                title="Volume"
              />
              {/* Visual Track */}
              <div className="w-1 h-full bg-gray-200 rounded-full overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 w-full bg-primary transition-all"
                  style={{ height: `${volume * 100}%` }}
                />
              </div>
              {/* Thumb */}
              <div
                className="absolute w-3 h-3 bg-white border border-gray-200 rounded-full shadow-md pointer-events-none"
                style={{ bottom: `calc(${volume * 100}% - 6px)` }}
              />
            </div>
            <div className="mt-2 text-[10px] font-sans text-textMain/70">
              {Math.round(volume * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Button */}
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-md
          transition-all duration-500 z-20
          ${isPlaying ? 'bg-primary text-white' : 'bg-white/80 text-primary'}
        `}
      >
        {/* Animated Rings when playing */}
        {isPlaying && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary/30 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 bg-primary/30 rounded-full"
            />
          </>
        )}

        {/* Icons */}
        <div className="relative z-10">
          {isPlaying ? (
            // Equalizer Icon
            <div className="flex items-end gap-[2px] h-4">
              <motion.div animate={{ height: [4, 12, 6, 14, 4] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              <motion.div animate={{ height: [10, 5, 16, 8, 10] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              <motion.div animate={{ height: [6, 14, 8, 12, 6] }} transition={{ duration: 0.9, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
              <motion.div animate={{ height: [12, 6, 10, 4, 12] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            </div>
          ) : (
            // Play Icon
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 15 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-full top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur text-textMain px-3 py-1.5 rounded-xl text-xs font-sans shadow-sm border border-gray-100 whitespace-nowrap ml-2"
          >
            Play Music
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
