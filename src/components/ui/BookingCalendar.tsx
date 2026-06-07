import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookedDay } from '../../types';

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
    <div className="mt-3 rounded-2xl border border-[#F4ACB7]/40 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
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
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3.5 h-3.5 rounded-md flex-shrink-0 ${color}`} />
    <span className="text-[10px] text-[#9D8189] font-sans">{label}</span>
  </div>
);

export default BookingCalendar;
