import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookedDay } from '../../types';
import termConditionImg from '../../assets/term-condition.jpeg';

interface BookingCalendarProps {
  bookedDays: BookedDay[];
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
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
    enter: (dir: number) => ({ x: dir * 30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -30, opacity: 0 }),
  };

  return (
    <>
      <div className="mt-3 rounded-2xl border border-mbell-border bg-mbell-canvas shadow-sm overflow-hidden relative">
        {/* ── Terms & Conditions Notice Banner ── */}
        <div className="bg-mbell-surface border-b border-mbell-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-sans text-mbell-ink">
            <span className="text-base flex-shrink-0">📜</span>
            <span className="font-medium text-[11px] sm:text-xs">
              Harap baca <strong className="text-mbell-primary">Syarat & Ketentuan</strong> sebelum memilih jadwal.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-mbell-canvas text-mbell-primary hover:bg-mbell-primary hover:text-mbell-canvas border border-mbell-border font-sans font-semibold text-[10px] uppercase tracking-wider shadow-sm transition-all duration-200 flex items-center gap-1.5 shrink-0"
          >
            <span>Baca S&K</span>
          </button>
        </div>

        {/* ── Header Navigasi Bulan ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-mbell-canvas border-b border-mbell-border">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="w-9 h-9 rounded-full flex items-center justify-center text-mbell-muted hover:bg-mbell-surface hover:text-mbell-ink transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="overflow-hidden h-6 flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={`${currentMonth}-${currentYear}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="font-serif font-medium text-base text-mbell-ink tracking-wide whitespace-nowrap"
              >
                {MONTHS[currentMonth]} {currentYear}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="w-9 h-9 rounded-full flex items-center justify-center text-mbell-muted hover:bg-mbell-surface hover:text-mbell-ink transition-colors"
            aria-label="Bulan berikutnya"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* ── Header Hari ── */}
        <div className="grid grid-cols-7 px-3 pt-3 pb-1 border-b border-mbell-border/40">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-[11px] font-sans font-medium text-mbell-muted py-1">
              {d}
            </div>
          ))}
        </div>

        {/* ── Grid Kalender dengan Touch Target Min 44x44px ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-mbell-rose border-t-transparent rounded-full animate-spin"></div>
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
              transition={{ duration: 0.2 }}
              className="grid grid-cols-7 gap-1 px-3 py-3"
            >
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="min-h-[44px]" />;
                }

                const { dateStr, isToday, isPast, isBooked, isSelected } = getDayState(day);
                const isHov = hoveredDate === dateStr;

                let cellClass =
                  'relative flex flex-col items-center justify-center rounded-xl w-full min-h-[44px] aspect-square select-none transition-all duration-150';

                if (isPast) {
                  cellClass += ' opacity-30 cursor-not-allowed';
                } else if (isBooked) {
                  cellClass += ' cursor-not-allowed';
                } else {
                  cellClass += ' cursor-pointer hover:bg-mbell-blush/40';
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
                    aria-label={
                      isBooked
                        ? `${dateStr} — Terisi: ${bookedMap[dateStr]}`
                        : dateStr
                    }
                  >
                    {/* Background layer */}
                    <div
                      className={[
                        'absolute inset-1 rounded-xl transition-all duration-150',
                        isSelected
                          ? 'bg-mbell-primary shadow-sm'
                          : isBooked
                          ? 'bg-mbell-surface border border-mbell-border'
                          : isToday && !isPast
                          ? 'border border-dashed border-mbell-rose bg-mbell-surface/50'
                          : '',
                      ].join(' ')}
                    />

                    {/* Day number */}
                    <span
                      className={[
                        'relative z-10 text-xs font-sans font-medium leading-none',
                        isSelected
                          ? 'text-mbell-canvas font-semibold'
                          : isBooked
                          ? 'text-mbell-muted'
                          : isPast
                          ? 'text-mbell-muted/60'
                          : isToday
                          ? 'text-mbell-primary font-bold'
                          : 'text-mbell-ink',
                      ].join(' ')}
                    >
                      {day}
                    </span>

                    {/* Booked indicator dot */}
                    {isBooked && (
                      <span className="relative z-10 mt-1 w-1.5 h-1.5 rounded-full bg-mbell-rose" />
                    )}

                    {/* Tooltip — booked days */}
                    {isBooked && isHov && (
                      <div className="absolute bottom-full mb-1 z-50 pointer-events-none flex flex-col items-center">
                        <div className="bg-mbell-ink text-mbell-canvas text-[10px] font-sans rounded-lg px-2.5 py-1 whitespace-nowrap shadow-md">
                          <div className="font-medium">Sudah Terisi</div>
                          <div className="opacity-80 text-[9px]">{bookedMap[dateStr]}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3 border-t border-mbell-border bg-mbell-surface/40">
          <LegendItem color="bg-mbell-surface border border-mbell-border" dot="bg-mbell-rose" label="Sudah Terisi" />
          <LegendItem color="bg-mbell-primary" label="Pilihan Anda" />
          <LegendItem color="border border-dashed border-mbell-rose bg-white" label="Hari Ini" />
        </div>
      </div>

      {/* ── Terms & Conditions Popup Modal ── */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] bg-mbell-ink/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-mbell-canvas rounded-3xl max-w-2xl w-full my-auto max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-mbell-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-5 py-4 bg-mbell-surface border-b border-mbell-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-mbell-ink font-medium">
                    Syarat & Ketentuan Booking
                  </h3>
                  <p className="text-xs text-mbell-muted font-sans">
                    Panduan & Kebijakan Reservasi MBell MakeUp
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-ink hover:text-mbell-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto p-4 bg-mbell-surface/30 flex flex-col items-center">
                <img
                  src={termConditionImg}
                  alt="Syarat & Ketentuan Booking MBell MakeUp"
                  className="rounded-xl shadow border border-mbell-border max-w-full h-auto"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 bg-mbell-canvas border-t border-mbell-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-6 py-2 bg-mbell-primary text-mbell-canvas font-sans font-medium text-xs rounded-full shadow-sm hover:bg-mbell-ink transition-colors"
                >
                  Saya Memahami S&K
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LegendItem: React.FC<{ color: string; dot?: string; label: string }> = ({ color, dot, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3 h-3 rounded-md flex items-center justify-center ${color}`}>
      {dot && <span className={`w-1 h-1 rounded-full ${dot}`} />}
    </div>
    <span className="text-[11px] text-mbell-muted font-sans">{label}</span>
  </div>
);

export default BookingCalendar;
