import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  checkLicenseStatus,
  verifyAccessCode,
  activateLicense,
  type LicenseStatus,
} from '../lib/siteGuard';
import FlowerBackground from './ui/FlowerBackground';
import logo from '../assets/logoBrand.png';

interface SiteGuardProps {
  children: React.ReactNode;
}

const WA_NUMBER = '6288293473765';
const WA_MESSAGE = encodeURIComponent(
  'Halo MBELL Makeup, saya ingin menghubungi Anda. Apakah website sedang dalam pemeliharaan?'
);

// ─── Petal animation for locked screen ──────────────────────────────────────
const FloatingPetal: React.FC<{ delay: number; x: number; size: number }> = ({
  delay,
  x,
  size,
}) => (
  <motion.div
    className="absolute top-0 pointer-events-none select-none"
    style={{ left: `${x}%`, fontSize: size }}
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{ y: '110vh', opacity: [0, 0.6, 0.6, 0], rotate: 360 }}
    transition={{ duration: 8 + delay, delay, repeat: Infinity, ease: 'linear' }}
  >
    🌸
  </motion.div>
);

// ─── Main SiteGuard Component ────────────────────────────────────────────────
const SiteGuard: React.FC<SiteGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<LicenseStatus>('loading');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Triple-click counter for hidden trigger
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch license on mount (no cache) ──────────────────────────────────
  const fetchStatus = useCallback(async () => {
    setStatus('loading');
    const result = await checkLicenseStatus();
    setStatus(result.status);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // ── Hidden trigger: triple-click on version badge ───────────────────────
  const handleVersionClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 800);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setShowAdminModal(true);
      setAccessCode('');
      setCodeError('');
    }
  };

  // ── Admin password submit ───────────────────────────────────────────────
  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setIsVerifying(true);

    const isValid = await verifyAccessCode(accessCode);

    if (!isValid) {
      setCodeError('Invalid access code. Please try again.');
      setIsVerifying(false);
      setAccessCode('');
      return;
    }

    // Password correct — activate 30 days
    const activated = await activateLicense();

    if (!activated) {
      setCodeError('Activation failed. Check your connection and try again.');
      setIsVerifying(false);
      return;
    }

    // Show success briefly then unlock
    setVerifySuccess(true);
    await new Promise((r) => setTimeout(r, 1200));

    setShowAdminModal(false);
    setVerifySuccess(false);
    setAccessCode('');
    setStatus('active');
  };

  // ── If active — render website normally ────────────────────────────────
  if (status === 'active') {
    return <>{children}</>;
  }

  // ── Loading state ───────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-[#FFFCF9] flex items-center justify-center z-[999]">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="MBell" className="w-16 h-16 opacity-70 animate-pulse" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#D4A5A5]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LOCKED SCREEN (inactive / expired / error) ──────────────────────────
  return (
    <div className="fixed inset-0 bg-[#FFFCF9] overflow-hidden z-[999]">
      {/* Floating flower background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <FlowerBackground />
      </div>

      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { delay: 0, x: 10, size: 14 },
          { delay: 2, x: 25, size: 10 },
          { delay: 4, x: 45, size: 16 },
          { delay: 1, x: 65, size: 12 },
          { delay: 3, x: 80, size: 14 },
          { delay: 5, x: 90, size: 10 },
        ].map((p, i) => (
          <FloatingPetal key={i} {...p} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-md w-full"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#F4ACB7]/20 flex items-center justify-center border border-[#D4A5A5]/30 shadow-lg">
                <div className="w-20 h-20 rounded-full bg-[#F4ACB7]/10 flex items-center justify-center">
                  <img src={logo} alt="MBell Makeup" className="w-16 h-16 object-contain" />
                </div>
              </div>
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-[#D4A5A5]/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Brand name */}
          <h1 className="font-serif text-4xl md:text-5xl text-[#4A403A] mb-3 tracking-wide">
            MBell MakeUp
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="h-[1px] w-16 bg-[#D4A5A5]/50" />
            <span className="text-[#D4A5A5] text-sm">✦</span>
            <div className="h-[1px] w-16 bg-[#D4A5A5]/50" />
          </div>

          {/* Maintenance message */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-8 py-8 shadow-sm border border-[#F4ACB7]/20 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F3] flex items-center justify-center mx-auto mb-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4A5A5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl text-[#4A403A] mb-3">
              Sedang Dalam Pemeliharaan
            </h2>

            <p className="font-sans text-[#9D8189] text-sm leading-relaxed">
              Kami sedang melakukan pembaruan sistem untuk memberikan pengalaman terbaik bagi Anda.
              Mohon kunjungi kembali dalam beberapa saat.
            </p>

            <div className="mt-6 pt-6 border-t border-[#F4ACB7]/20">
              <p className="font-sans text-xs text-[#9D8189]/60 mb-4 uppercase tracking-widest">
                Butuh bantuan segera?
              </p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#D4A5A5] hover:bg-[#c49595] text-white font-sans text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi via WhatsApp
              </a>
            </div>
          </div>

          {/* Tagline */}
          <p className="font-sans text-xs text-[#9D8189]/50 uppercase tracking-widest">
            Enhancing Natural Beauty · Est. {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>

      {/* ── Hidden Admin Trigger (version badge, bottom-right) ── */}
      <button
        type="button"
        onClick={handleVersionClick}
        className="fixed bottom-4 right-5 font-sans text-[10px] text-[#9D8189]/20 hover:text-[#9D8189]/50 select-none cursor-default z-20 transition-opacity duration-300"
        tabIndex={-1}
        aria-hidden="true"
      >
        v1.0.0
      </button>

      {/* ── Admin Modal ── */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            style={{ backdropFilter: 'blur(8px)', background: 'rgba(74,64,58,0.35)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAdminModal(false);
                setCodeError('');
                setAccessCode('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden"
            >
              {/* Modal header */}
              <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FDF6F8] px-6 pt-7 pb-5 border-b border-[#F4ACB7]/20 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#F4ACB7]/30 flex items-center justify-center mb-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4A5A5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg text-[#4A403A]">System Access</h3>
                <p className="font-sans text-[10px] text-[#9D8189]/60 mt-1 uppercase tracking-widest">
                  Authorized personnel only
                </p>
              </div>

              {/* Modal body */}
              <div className="px-6 py-6">
                {verifySuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FFF0F3] flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#D4A5A5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="font-sans text-sm text-[#9D8189] font-medium">
                      Access granted — 30 days
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleAccessSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-sans text-xs font-bold text-[#9D8189] uppercase tracking-wider">
                        Access Code
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={accessCode}
                          onChange={(e) => {
                            setAccessCode(e.target.value);
                            setCodeError('');
                          }}
                          autoFocus
                          autoComplete="off"
                          placeholder="••••••••••••••"
                          className={[
                            'w-full pl-4 pr-11 py-3 rounded-xl bg-[#FFFCF9] border outline-none transition-all font-sans text-sm text-[#4A403A] tracking-widest',
                            codeError
                              ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                              : 'border-[#F4ACB7]/50 focus:border-[#D4A5A5] focus:ring-1 focus:ring-[#D4A5A5]/30',
                          ].join(' ')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9D8189]/50 hover:text-[#D4A5A5] transition-colors duration-200"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            // Eye-off icon
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            // Eye icon
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {codeError && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-sans text-xs text-red-400 flex items-center gap-1"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          {codeError}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminModal(false);
                          setAccessCode('');
                          setCodeError('');
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-[#F4ACB7]/40 font-sans text-sm text-[#9D8189] hover:bg-[#FFF0F3] transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifying || !accessCode}
                        className="flex-1 py-2.5 rounded-xl bg-[#D4A5A5] hover:bg-[#c49595] text-white font-sans text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isVerifying ? (
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Verify</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SiteGuard;
