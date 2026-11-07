
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CLOSE_BACKDROP_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='rgba(20,15,15,0.78)' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M11 11L21 21M21 11L11 21' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 16 16, pointer`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Custom "X" Exit Cursor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ cursor: CLOSE_BACKDROP_CURSOR }}
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[80vh] md:max-h-[90vh] flex flex-col md:flex-row cursor-default"
            >
              {/* Close Button "X" (Highest Z-index, perfectly visible & clickable) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-mbell-ink hover:text-mbell-primary flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 active:scale-95 border border-black/10 backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
