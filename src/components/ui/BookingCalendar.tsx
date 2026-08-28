import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookedDay } from '../../types';
import termConditionImg from '../../assets/term&Condition.jpeg';

interface BookingCalendarProps {
  bookedDays: BookedDay[];
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookedDays,
  selectedDate,
  onSelectDate,
  isLoading = false,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1); // for slide animation
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsZoom, setTermsZoom] = useState(100); // 100% baseline

  // Build a map: 'YYYY-MM-DD' -> service
  const bookedMap = useMemo(() => {
    const map: Record<string, string> = {};
    bookedDays.forEach((b) => {
      map[b.date] = b.service;
    });
    return map;
  }, [bookedDays]);

  // Generate calendar grid for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sun...6=Sat

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

    return days;
  }, [currentYear, currentMonth]);

  const formatDate = (year: number, month: number, day: number): string => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const goToPrevMonth = () => {
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setDirection(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const clickedDate = new Date(currentYear, currentMonth, day);

    // Prevent clicking on past dates or fully booked dates
    if (clickedDate < today) return;
    if (bookedMap[dateStr]) return;

    onSelectDate(dateStr);
  };

  const getDayState = (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const d = new Date(currentYear, currentMonth, day);
    const isToday = d.getTime() === today.getTime();
    const isPast = d < today;
    const isBooked = !!bookedMap[dateStr];
    const isSelected = dateStr === selectedDate;
    const isHovered = dateStr === hoveredDate;

    return { dateStr, isToday, isPast, isBooked, isSelected, isHovered };
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  return (
    <>
      <div className="mt-3 rounded-2xl border border-[#F4ACB7]/40 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden relative">
        {/* ── Terms & Conditions Notice Banner ── */}
        <div className="bg-gradient-to-r from-[#FFF0F3] via-[#FDE8ED] to-[#FFF0F3] border-b border-[#F4ACB7]/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-sans text-[#7A525E]">
            <span className="text-base flex-shrink-0">📜</span>
            <span className="font-semibold text-[11px] sm:text-xs">
              Harap pelajari <strong className="text-[#B56576]">Syarat & Ketentuan</strong> sebelum booking!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-white text-[#B56576] hover:bg-[#B56576] hover:text-white border border-[#F4ACB7]/60 font-sans font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all duration-200 flex items-center gap-1.5 group shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Baca S&K</span>
          </button>
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#FFF0F3] to-[#FDF6F8] border-b border-[#F4ACB7]/30">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9D8189] hover:bg-[#F4ACB7]/30 hover:text-[#D4A5A5] transition-all duration-200"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="overflow-hidden h-6 flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={`${currentMonth}-${currentYear}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="font-sans font-semibold text-sm text-[#4A403A] tracking-wide absolute"
              >
                {MONTHS[currentMonth]} {currentYear}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9D8189] hover:bg-[#F4ACB7]/30 hover:text-[#D4A5A5] transition-all duration-200"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* ── Day of Week Headers ── */}
        <div className="grid grid-cols-7 px-3 pt-3 pb-1">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-[#9D8189]/70 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* ── Calendar Grid ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#F4ACB7]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`grid-${currentMonth}-${currentYear}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="grid grid-cols-7 gap-y-1 px-3 pb-4 pt-1"
            >
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} />;
                }

                const { dateStr, isToday, isPast, isBooked, isSelected } = getDayState(day);
                const isHov = hoveredDate === dateStr;

                let cellClass =
                  'relative flex flex-col items-center justify-center rounded-xl w-full aspect-square cursor-pointer select-none transition-all duration-150 group';

                if (isPast) {
                  cellClass += ' opacity-30 cursor-not-allowed';
                } else if (isBooked) {
                  cellClass += ' cursor-not-allowed';
                } else if (isSelected) {
                  cellClass += ' cursor-pointer';
                }

                return (
                  <div
                    key={dateStr}
                    className={cellClass}
                    onClick={() => !isPast && handleDayClick(day)}
                    onMouseEnter={() => setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    role="button"
                    tabIndex={isPast || isBooked ? -1 : 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleDayClick(day);
                    }}
                    aria-label={
                      isBooked
                        ? `${dateStr} — Booked: ${bookedMap[dateStr]}`
                        : dateStr
                    }
                  >
                    {/* Background layer */}
                    <div
                      className={[
                        'absolute inset-[2px] rounded-xl transition-all duration-150',
                        isSelected
                          ? 'bg-[#D4A5A5] shadow-md'
                          : isBooked
                          ? 'bg-[#FADADD]'
                          : isToday && !isPast
                          ? 'bg-white ring-1 ring-[#D4A5A5] ring-dashed'
                          : !isPast && isHov
                          ? 'bg-[#FFF0F2]'
                          : '',
                      ].join(' ')}
                    />

                    {/* Day number */}
                    <span
                      className={[
                        'relative z-10 text-xs font-semibold leading-none',
                        isSelected
                          ? 'text-white'
                          : isBooked
                          ? 'text-[#C4828E]'
                          : isPast
                          ? 'text-[#4A403A]'
                          : isToday
                          ? 'text-[#D4A5A5] font-bold'
                          : 'text-[#4A403A]',
                      ].join(' ')}
                    >
                      {day}
                    </span>

                    {/* Booked indicator dot */}
                    {isBooked && (
                      <span className="relative z-10 mt-0.5 w-1 h-1 rounded-full bg-[#F4ACB7]" />
                    )}

                    {/* Tooltip — shown on hover for booked days */}
                    {isBooked && isHov && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-[#4A403A] text-white text-[10px] font-sans rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                          <div className="font-semibold">🌸 Sudah Dipesan</div>
                          <div className="opacity-75 mt-0.5">{bookedMap[dateStr]}</div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#4A403A]" />
                        </div>
                      </motion.div>
                    )}

                    {/* Tooltip — past date message */}
                    {isPast && isHov && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-[#9D8189] text-white text-[10px] font-sans rounded-lg px-2 py-1.5 whitespace-nowrap shadow-xl">
                          Tanggal sudah lewat
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#9D8189]" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-3 border-t border-[#F4ACB7]/20 bg-[#FFFCF9]">
          <LegendItem color="bg-[#FADADD] ring-1 ring-[#F4ACB7]" label="Sudah ada booking" />
          <LegendItem color="bg-[#D4A5A5]" label="Tanggal dipilih" />
          <LegendItem color="bg-white ring-1 ring-dashed ring-[#D4A5A5]" label="Hari ini" />
        </div>
      </div>

      {/* ── Terms & Conditions Popup Modal ── */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full my-auto max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#FFF0F3] to-[#FDF6F8] border-b border-[#F4ACB7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 relative">
                <div className="flex items-center gap-2.5 pr-10 sm:pr-0">
                  <span className="text-2xl">📜</span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#4A403A] font-bold leading-tight">
                      Syarat & Ketentuan Booking
                    </h3>
                    <p className="text-[10px] text-[#9D8189] font-sans">
                      MBELL Makeup Services & Booking Rules
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl shadow-sm border border-[#F4ACB7]/30">
                    <button
                      type="button"
                      onClick={() => setTermsZoom(z => Math.max(z - 25, 50))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                      title="Zoom Out"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 w-8 sm:w-10 text-center">{termsZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setTermsZoom(z => Math.min(z + 25, 250))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                      title="Zoom In"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    
                    <div className="w-[1px] h-4 bg-gray-200 mx-0.5 sm:mx-1"></div>
                    
                    <a
                      href={termConditionImg}
                      download="Syarat-Ketentuan-MBell-Makeup.jpg"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F3] hover:bg-[#F4ACB7] text-[#B56576] hover:text-white flex items-center justify-center transition-colors"
                      title="Download S&K"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTermsModal(false);
                      setTermsZoom(100);
                    }}
                    className="absolute top-3 right-4 sm:relative sm:top-auto sm:right-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#9D8189] hover:bg-[#F4ACB7]/20 hover:text-[#B56576] flex items-center justify-center transition-all shadow-sm border border-gray-100"
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body: Scrollable Image via Native CSS */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 flex flex-col items-center justify-start relative">

                <div 
                  className={`w-full flex origin-top pb-10 ${termsZoom <= 100 ? 'justify-center' : 'justify-start'}`}
                  style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
                >
                  <img
                    src={termConditionImg}
                    alt="Syarat & Ketentuan Booking MBELL Makeup"
                    className="rounded-2xl shadow-md border border-gray-200"
                    style={{ 
                      width: `${termsZoom}%`, 
                      maxWidth: 'none', 
                      height: 'auto', 
                      transition: 'width 0.2s ease-out' 
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="text-[11px] text-[#9D8189] font-sans text-center sm:text-left">
                  *Pastikan Anda telah membaca seluruh syarat sebelum memilih tanggal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowTermsModal(false);
                    setTermsZoom(100);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#B56576] hover:bg-[#9D8189] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all shrink-0"
                >
                  Saya Mengerti
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3.5 h-3.5 rounded-md flex-shrink-0 ${color}`} />
    <span className="text-[10px] text-[#9D8189] font-sans">{label}</span>
  </div>
);

export default BookingCalendar;
