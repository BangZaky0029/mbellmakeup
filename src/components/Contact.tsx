import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import BookingCalendar from './ui/BookingCalendar';
import { supabase } from '../lib/supabase';
import type { BookedDay } from '../types';
import termConditionImg from '../assets/term&Condition.jpeg';

const SERVICES = [
  'Wedding / Akad',
  'Pre-Wedding',
  'Graduation / Wisuda',
  'Party / Pesta',
  'Engagement / Lamaran',
  'Photoshoot',
  'Makeup Course'
];

const TIME_PRESETS = ['06:00', '08:00', '10:00', '13:00', '15:00', '17:00'];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: SERVICES[0],
    date: '',
    time: '08:00',
    address: '',
    message: ''
  });

  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Booking calendar state
  const [bookedDays, setBookedDays] = useState<BookedDay[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [dateError, setDateError] = useState<string | null>(null);

  // Terms & Conditions confirmation modal state
  const [showTermsConfirmModal, setShowTermsConfirmModal] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [termsZoom, setTermsZoom] = useState(100); // 100% baseline

  // ── Fetch booked dates from Supabase ──────────────────────────────
  const fetchBookedDates = useCallback(async () => {
    setIsCalendarLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date, service')
        .eq('status', 'confirmed');

      if (error) throw error;

      const mapped: BookedDay[] = (data || []).map((row: { booking_date: string; service: string }) => ({
        date: row.booking_date,
        service: row.service,
      }));

      setBookedDays(mapped);
    } catch (err) {
      console.error('Failed to fetch booked dates:', err);
    } finally {
      setIsCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedDates();
  }, [fetchBookedDates]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'date') {
      setDateError(null);
      // Check if selected date is already booked
      const alreadyBooked = bookedDays.find((b) => b.date === value);
      if (alreadyBooked) {
        setDateError(`Tanggal ini sudah dipesan untuk ${alreadyBooked.service}. Silakan pilih tanggal lain.`);
      }
    }
  };

  // Called when user clicks a date directly on the calendar
  const handleCalendarSelectDate = (dateStr: string) => {
    setFormData((prev) => ({ ...prev, date: dateStr }));
    setDateError(null); // calendar already prevents booked/past dates
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData((prev) => ({ ...prev, address: mapsLink }));
        setIsLoadingLoc(false);
      },
      (error) => {
        console.error(error);
        alert('Unable to retrieve your location. Please type your address manually.');
        setIsLoadingLoc(false);
      }
    );
  };

  // ── Submit Step 1: Validate & Open S&K Modal ─────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Guard: date must be selected
    if (!formData.date) {
      setDateError('Silakan pilih tanggal reservasi pada kalender di bawah terlebih dahulu.');
      return;
    }

    // Guard: date must not be already booked
    const alreadyBooked = bookedDays.find((b) => b.date === formData.date);
    if (alreadyBooked) {
      setDateError(
        `Tanggal ini sudah dipesan untuk ${alreadyBooked.service}. Silakan pilih tanggal lain.`
      );
      return;
    }

    if (!formData.time) {
      setDateError('Silakan masukkan jam / waktu acara.');
      return;
    }

    // Reset agreement & show modal
    setIsTermsAgreed(false);
    setShowTermsConfirmModal(true);
  };

  // ── Submit Step 2: User Confirmed S&K -> Save DB & Open WhatsApp ─
  const handleConfirmBooking = async () => {
    if (!isTermsAgreed) return;

    setShowTermsConfirmModal(false);
    setIsSubmitting(true);

    try {
      // ── 1. Save to Supabase ────────────────────────────────────────
      const { error: dbError } = await supabase.from('bookings').insert([
        {
          client_name: formData.name,
          service: formData.service,
          booking_date: formData.date,
          address: formData.address || null,
          message: formData.message || null,
          status: 'confirmed',
        },
      ]);

      if (dbError) {
        // Handle duplicate date (unique constraint violation)
        if (dbError.code === '23505') {
          setDateError('Tanggal ini baru saja dipesan orang lain. Silakan pilih tanggal lain.');
          await fetchBookedDates(); // refresh calendar
          setIsSubmitting(false);
          return;
        }
        throw dbError;
      }

      // ── 2. Open WhatsApp ───────────────────────────────────────────
      const phoneNumber = '6288293473765';
      const formattedDate = new Date(formData.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedTime = formData.time ? `${formData.time} WIB` : '-';

      const text = `🌸 *RESERVASI MAKEUP — MBELL MAKEUP* 🌸

*Detail Klien:*
• Nama Lengkap: ${formData.name}
• Jenis Layanan: ${formData.service}

*Jadwal & Waktu Acara:*
• Tanggal: ${formattedDate}
• Jam / Waktu Acara: ${formattedTime}

*Lokasi & Catatan:*
• Alamat / Lokasi Event: ${formData.address}
• Pesan / Catatan Khusus: ${formData.message || '-'}

----------------------------------
✅ *Persetujuan S&K:* Saya telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan Booking MBELL Makeup.

Terima kasih!`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');

      // ── 3. Update local state & show success ─────────────────────
      setBookedDays((prev) => [
        ...prev,
        { date: formData.date, service: formData.service },
      ]);

      setSubmitSuccess(true);
      setFormData({
        name: '',
        service: SERVICES[0],
        date: '',
        time: '08:00',
        address: '',
        message: '',
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-textMain mb-4"
          >
            Get In Touch
          </motion.h2>
          <p className="text-textMain/60 font-sans text-lg">
            Ready to book your appointment? Let's create something beautiful together!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100"
        >
          {/* ── Success Banner ── */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 bg-[#FFF0F3] border border-[#F4ACB7] rounded-2xl px-5 py-4"
            >
              <span className="text-2xl">🌸</span>
              <div>
                <p className="font-semibold text-[#9D8189] text-sm">Reservasi Berhasil!</p>
                <p className="text-[#9D8189]/70 text-xs mt-0.5">
                  Tanggal booking sudah tersimpan. Silakan lanjutkan chat di WhatsApp.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Row 1: Name + Service ── */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                  Service Interested
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Row 2: Reservation Date (via Calendar) & Time Input ── */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                  Pilih Tanggal Reservasi *
                </label>
                {formData.date && (
                  <span className="text-xs font-semibold text-[#B56576] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F4ACB7]/40 flex items-center gap-1.5 w-fit">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Dipilih: {new Date(formData.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Date error message */}
              {dateError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 font-sans flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {dateError}
                </motion.p>
              )}

              {/* ── Booking Calendar ── */}
              <BookingCalendar
                bookedDays={bookedDays}
                selectedDate={formData.date}
                onSelectDate={handleCalendarSelectDate}
                isLoading={isCalendarLoading}
              />

              <p className="text-xs text-textMain/40 font-sans text-center">
                🌸 Tanggal berwarna pink menandakan sudah ada reservasi. Klik tanggal di atas untuk memilih.
              </p>

              {/* ── Time Picker Field (Shown after Date is selected) ── */}
              {formData.date && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-4 border-t border-gray-100 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#4A403A] uppercase tracking-wider flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B56576" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Jam / Waktu Acara *
                    </label>
                    <span className="text-[10px] text-textMain/40 font-sans italic">Format 24 Jam / WIB</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-textMain"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-textMain/50 font-bold uppercase tracking-wider mr-1">Preset:</span>
                      {TIME_PRESETS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, time: t }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            formData.time === t
                              ? 'bg-[#B56576] text-white shadow-sm'
                              : 'bg-gray-100 text-textMain/70 hover:bg-gray-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Row 3: Address ── */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                Address / Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Type address or use location button"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLoadingLoc}
                  className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-xl transition-all flex items-center justify-center whitespace-nowrap"
                  title="Get Current Location"
                >
                  {isLoadingLoc ? (
                    <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-textMain/50">
                Click the pin icon to automatically attach your Google Maps location.
              </p>
            </div>

            {/* ── Row 4: Message ── */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell me more about your event details..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            {/* ── Submit error ── */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {submitError}
              </motion.div>
            )}

            {/* ── Submit button ── */}
            <div className="pt-4 flex justify-center sm:justify-start">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !!dateError}
                className="w-full sm:w-auto px-10 py-4 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>Send via WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* ── Terms & Conditions Confirmation Modal before WhatsApp ── */}
      <AnimatePresence>
        {showTermsConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setShowTermsConfirmModal(false)}
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
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#4A403A] font-bold leading-tight">
                      Konfirmasi Syarat & Ketentuan
                    </h3>
                    <p className="text-[10px] text-[#9D8189] font-sans">
                      Harap baca & menyetujui ketentuan sebelum mengirim pesanan
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
                      setShowTermsConfirmModal(false);
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

              {/* Modal Footer with Checkbox & Submit */}
              <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <label className="flex items-start sm:items-center gap-3 cursor-pointer text-xs font-sans text-[#4A403A] select-none">
                  <input
                    type="checkbox"
                    checked={isTermsAgreed}
                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-[#B56576] focus:ring-[#B56576] accent-[#B56576] cursor-pointer shrink-0"
                  />
                  <span className="leading-snug">
                    Saya telah membaca, memahami, dan menyetujui seluruh <strong className="text-[#B56576]">Syarat & Ketentuan</strong> di atas.
                  </span>
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowTermsConfirmModal(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!isTermsAgreed}
                    onClick={handleConfirmBooking}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#B56576] hover:bg-[#9D8189] disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Setuju & Kirim WA</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;