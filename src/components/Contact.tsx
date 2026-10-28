import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingCalendar from './ui/BookingCalendar';
import { supabase } from '../lib/supabase';
import type { BookedDay } from '../types';
import termConditionImg from '../assets/term-condition.jpeg';
import RandomTextReveal from './ui/RandomTextReveal';

const SERVICES = [
  'Wedding / Akad Nikah',
  'Pre-Wedding Shoot',
  'Wisuda / Graduation',
  'Pesta / Party / Gala',
  'Lamaran / Engagement',
  'Photoshoot / Editorial',
  'Kelas Makeup Personal',
];

const TIME_PRESETS = ['06:00', '08:00', '10:00', '13:00', '15:00', '17:00'];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: SERVICES[0],
    date: '',
    time: '08:00',
    address: '',
    message: '',
  });

  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Booking calendar state
  const [bookedDays, setBookedDays] = useState<BookedDay[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Terms & Conditions confirmation modal state
  const [showTermsConfirmModal, setShowTermsConfirmModal] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [termsZoom, setTermsZoom] = useState(100);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

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

  // ── Validation Helpers ───────────────────────────────────────────
  const isTimeAllowed = (timeStr: string, dateStr: string) => {
    if (!timeStr || !dateStr) return true;

    const today = new Date();
    const localYear = today.getFullYear();
    const localMonth = String(today.getMonth() + 1).padStart(2, '0');
    const localDate = String(today.getDate()).padStart(2, '0');
    const todayStr = `${localYear}-${localMonth}-${localDate}`;

    if (dateStr === todayStr) {
      const [h, m] = timeStr.split(':').map(Number);
      const selectedMins = h * 60 + m;
      const currentMins = today.getHours() * 60 + today.getMinutes();
      return selectedMins >= currentMins + 180; // 3 hours ahead
    }
    return true;
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'date') {
      setDateError(null);
      setTimeError(null);
      const alreadyBooked = bookedDays.find((b) => b.date === value);
      if (alreadyBooked) {
        setDateError(`Tanggal ini sudah dipesan untuk ${alreadyBooked.service}. Silakan pilih tanggal lain.`);
      }
    }

    if (name === 'time') {
      setTimeError(null);
    }
  };

  const handleCalendarSelectDate = (dateStr: string) => {
    setFormData((prev) => ({ ...prev, date: dateStr }));
    setDateError(null);
    setTimeError(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser Anda');
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
        alert('Tidak dapat mendeteksi lokasi otomatis. Mohon ketikkan alamat secara manual.');
        setIsLoadingLoc(false);
      }
    );
  };

  // ── Submit Step 1: Validate & Open S&K Modal ─────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.date) {
      setDateError('Silakan pilih tanggal reservasi pada kalender terlebih dahulu.');
      return;
    }

    const alreadyBooked = bookedDays.find((b) => b.date === formData.date);
    if (alreadyBooked) {
      setDateError(
        `Tanggal ini sudah dipesan untuk ${alreadyBooked.service}. Silakan pilih tanggal lain.`
      );
      return;
    }

    if (!formData.time) {
      setTimeError('Silakan tentukan jam / waktu mulai makeup.');
      return;
    }

    if (!isTimeAllowed(formData.time, formData.date)) {
      setTimeError('Untuk reservasi hari ini, mohon pilih waktu minimal 3 jam dari sekarang.');
      return;
    }

    setIsTermsAgreed(false);
    setShowTermsConfirmModal(true);
  };

  // ── Submit Step 2: Save to Supabase & Open WhatsApp ───────────────
  const handleConfirmBooking = async () => {
    if (!isTermsAgreed) return;

    setShowTermsConfirmModal(false);
    setIsSubmitting(true);

    try {
      // 1. Simpan ke Supabase
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
        if (dbError.code === '23505') {
          setDateError('Tanggal ini baru saja dipesan orang lain. Silakan pilih tanggal lain.');
          await fetchBookedDates();
          setIsSubmitting(false);
          return;
        }
        throw dbError;
      }

      // 2. Format Pesan WhatsApp
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

*Jadwal & Waktu Makeup:*
• Tanggal: ${formattedDate}
• Jam Mulai: ${formattedTime}

*Lokasi & Catatan:*
• Alamat / Lokasi: ${formData.address}
• Catatan Khusus: ${formData.message || '-'}

----------------------------------
✅ *Persetujuan S&K:* Saya telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan Booking MBell MakeUp.

Terima kasih!`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');

      // 3. Update status lokal
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
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Terjadi kendala saat menyimpan reservasi. Silakan hubungi via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-mbell-surface/40 border-b border-mbell-border relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">

        {/* Header Seksi */}
        <div className="max-w-xl text-left mb-10">
          <RandomTextReveal
            as="h2"
            text="Pilih tanggal & amankan jadwalmu."
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-mbell-ink mb-3 leading-tight"
            delayBase={0.1}
          />
          <p className="font-sans text-sm sm:text-base text-mbell-muted leading-relaxed">
            Periksa ketersediaan tanggal pada kalender di bawah, isi rincian acara Anda, dan kami akan segera mengonfirmasi pesanan Anda via WhatsApp.
          </p>
        </div>

        {/* Card Formulir Kontak */}
        <div className="bg-mbell-canvas rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_rgba(42,33,33,0.04)] border border-mbell-border text-left">

          {/* Banner Sukses */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-3 bg-mbell-surface border border-mbell-border rounded-2xl px-5 py-4"
            >
              <span className="text-xl">🌸</span>
              <div>
                <p className="font-serif font-medium text-mbell-ink text-sm">Reservasi Berhasil Dicatat!</p>
                <p className="text-mbell-muted text-xs mt-0.5">
                  Slot tanggal Anda sudah tersimpan. Silakan lanjutkan komunikasi di WhatsApp kami.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Nama & Layanan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nama lengkap Anda"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                  Jenis Layanan Makeup *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all cursor-pointer"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Kalender Pemesanan */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="text-xs font-sans font-medium text-mbell-ink">
                  Pilih Tanggal Reservasi *
                </label>
                {formData.date && (
                  <span className="text-xs font-sans font-medium text-mbell-primary bg-mbell-surface px-3 py-1 rounded-full border border-mbell-border flex items-center gap-1.5 w-fit">
                    <span>Terpilih:</span>
                    <strong>{new Date(formData.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </span>
                )}
              </div>

              {dateError && (
                <p className="text-xs text-red-500 font-sans flex items-center gap-1.5">
                  <span>⚠</span> {dateError}
                </p>
              )}

              <BookingCalendar
                bookedDays={bookedDays}
                selectedDate={formData.date}
                onSelectDate={handleCalendarSelectDate}
                isLoading={isCalendarLoading}
              />

              {/* Time Picker (Ditampilkan saat tanggal sudah dipilih) */}
              {formData.date && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 border-t border-mbell-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-medium text-mbell-ink">
                      Jam / Waktu Mulai Makeup *
                    </label>
                    <span className="text-[11px] text-mbell-muted font-sans">WIB (Waktu Indonesia Barat)</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="min-h-[46px] px-4 py-2 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose"
                    />

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-mbell-muted font-sans mr-1">Pilihan Cepat:</span>
                      {TIME_PRESETS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, time: t }));
                            setTimeError(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${formData.time === t
                              ? 'bg-mbell-primary text-mbell-canvas shadow-sm'
                              : 'bg-mbell-surface text-mbell-ink hover:bg-mbell-blush/60'
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {timeError && (
                    <p className="text-xs text-red-500 font-sans italic">
                      * {timeError}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Row 3: Alamat / Lokasi Acara */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-mbell-ink">
                Lokasi / Alamat Acara (On-Location) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ketik alamat lengkap atau gunakan pin lokasi"
                  required
                  className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLoadingLoc}
                  className="min-h-[48px] px-4 rounded-xl bg-mbell-surface border border-mbell-border text-mbell-ink hover:bg-mbell-blush/60 transition-colors flex items-center justify-center shrink-0"
                  title="Ambil Lokasi Saat Ini"
                >
                  {isLoadingLoc ? (
                    <span className="w-5 h-5 border-2 border-mbell-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mbell-primary">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-[11px] font-sans text-mbell-muted">
                Ketuk ikon pin untuk melampirkan tautan Google Maps secara otomatis.
              </p>
            </div>

            {/* Row 4: Catatan Khusus */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-medium text-mbell-ink">
                Catatan / Kebutuhan Khusus (Opsional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ceritakan detail busana, hijab do, atau request khusus lainnya..."
                className="w-full px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all resize-none"
              />
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {submitError}
              </div>
            )}

            {/* Tombol Submit WhatsApp */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !!dateError}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-sm flex items-center justify-center gap-2 hover:bg-mbell-ink transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan Jadwal...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut Pesan via WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── Modal Konfirmasi Syarat & Ketentuan Sebelum WhatsApp ── */}
      <AnimatePresence>
        {showTermsConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] bg-mbell-ink/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTermsConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-mbell-canvas rounded-3xl max-w-2xl w-full my-auto max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-mbell-border text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 bg-mbell-surface border-b border-mbell-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-mbell-ink">
                    Konfirmasi Syarat & Ketentuan
                  </h3>
                  <p className="text-xs text-mbell-muted font-sans">
                    Harap baca & setujui ketentuan layanan sebelum mengirim pesanan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsConfirmModal(false)}
                  className="w-8 h-8 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-ink hover:text-mbell-primary"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Gambar S&K */}
              <div
                className="flex-1 overflow-auto p-4 bg-mbell-surface/30 flex flex-col items-center"
                onTouchMove={(e) => {
                  if (e.touches.length === 2) {
                    const t1 = e.touches[0];
                    const t2 = e.touches[1];
                    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
                    if (lastTouchDistance !== null) {
                      const delta = dist - lastTouchDistance;
                      setTermsZoom(z => Math.min(Math.max(z + delta * 0.5, 50), 300));
                    }
                    setLastTouchDistance(dist);
                  }
                }}
                onTouchEnd={() => setLastTouchDistance(null)}
                onTouchCancel={() => setLastTouchDistance(null)}
              >
                <img
                  src={termConditionImg}
                  alt="Syarat & Ketentuan Booking MBell MakeUp"
                  className="rounded-xl shadow border border-mbell-border max-w-full h-auto"
                  style={{ width: `${termsZoom}%` }}
                />
              </div>

              {/* Modal Footer with Checkbox */}
              <div className="px-5 py-4 bg-mbell-canvas border-t border-mbell-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-sans text-mbell-ink select-none">
                  <input
                    type="checkbox"
                    checked={isTermsAgreed}
                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                    className="w-4 h-4 rounded text-mbell-primary focus:ring-mbell-rose accent-mbell-primary cursor-pointer shrink-0"
                  />
                  <span>
                    Saya telah membaca & menyetujui seluruh <strong className="text-mbell-primary">Syarat & Ketentuan</strong>.
                  </span>
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowTermsConfirmModal(false)}
                    className="min-h-[42px] px-4 py-2 rounded-full bg-mbell-surface border border-mbell-border text-mbell-ink text-xs font-sans font-medium hover:bg-mbell-blush/60 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!isTermsAgreed}
                    onClick={handleConfirmBooking}
                    className="flex-1 sm:flex-initial min-h-[42px] px-6 py-2 rounded-full bg-mbell-primary text-mbell-canvas text-xs font-sans font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mbell-ink transition-colors shadow-sm"
                  >
                    Kirim via WhatsApp
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