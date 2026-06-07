import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import BookingCalendar from './ui/BookingCalendar';
import { supabase } from '../lib/supabase';
import type { BookedDay } from '../types';

const SERVICES = [
  'Wedding / Akad',
  'Pre-Wedding',
  'Graduation / Wisuda',
  'Party / Pesta',
  'Engagement / Lamaran',
  'Photoshoot',
  'Makeup Course'
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: SERVICES[0],
    date: '',
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

  // ── Submit — Dual Action: Supabase + WhatsApp ─────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Guard: date must be selected
    if (!formData.date) {
      setDateError('Silakan pilih tanggal reservasi terlebih dahulu.');
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

      const text = `Halo MBELL Makeup, saya ingin melakukan reservasi.

Nama: ${formData.name}
Layanan: ${formData.service}
Tanggal: ${formattedDate}
Alamat/Lokasi: ${formData.address}
Pesan: ${formData.message}

Terima kasih.`;

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

            {/* ── Row 2: Reservation Date + Calendar ── */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-textMain uppercase tracking-wider">
                Reservation Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className={[
                  'w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition-all text-textMain/70',
                  dateError
                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-300'
                    : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary',
                ].join(' ')}
              />

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
                🌸 Tanggal berwarna pink menandakan sudah ada reservasi. Klik tanggal untuk memilih.
              </p>
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
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !!dateError}
                className="w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>Send via WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    </section>
  );
};

export default Contact;