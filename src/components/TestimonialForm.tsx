import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface TestimonialFormProps {
  onSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: ''
  });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("Ukuran file maksimal 10MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      let imageUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images_mbell')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images_mbell')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('testimonials')
        .insert([{
          name: formData.name,
          role: formData.role || 'Klien Bahagia',
          content: formData.content,
          image_url: imageUrl,
          rating: rating,
          is_approved: true
        }]);

      if (insertError) throw insertError;

      setStatus('success');
      setFormData({ name: '', role: '', content: '' });
      setRating(5);
      setFile(null);
      setPreview(null);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Terjadi kendala saat mengirim testimoni. Silakan coba kembali.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <div className="bg-mbell-canvas border border-mbell-border rounded-3xl p-6 sm:p-10 shadow-[0_10px_30px_rgba(42,33,33,0.04)] text-left">
        
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-mbell-ink mb-2">
            Bagikan Cerita Riasan Anda
          </h3>
          <p className="font-sans text-xs sm:text-sm text-mbell-muted">
            Ulasan dan pengalaman berhargamu sangat berarti bagi kami ✨
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-mbell-surface border border-mbell-border text-mbell-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h4 className="font-serif text-2xl text-mbell-ink mb-2">Terima Kasih Banyak!</h4>
              <p className="text-mbell-muted font-sans text-sm mb-6">
                Testimoni Anda telah tersimpan dan akan tampil pada halaman galeri kami.
              </p>
              <button 
                type="button"
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border text-xs font-medium hover:bg-mbell-blush/60 transition-colors" 
                onClick={() => setStatus('idle')}
              >
                Tulis Ulasan Lain
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Selector */}
              <div className="flex flex-col items-center gap-2 pb-2">
                <label className="text-xs font-sans font-medium text-mbell-muted">
                  Beri Penilaian Layanan
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none p-1"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="28" 
                        height="28" 
                        viewBox="0 0 24 24" 
                        fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"} 
                        stroke={(hoverRating || rating) >= star ? "#F59E0B" : "#E6D7D2"}
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Sarah Anindita"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                    Jenis Acara
                  </label>
                  <input 
                    type="text" 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Contoh: Akad & Resepsi / Wisuda"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                  Pengalaman & Kesan Riasan *
                </label>
                <textarea 
                  name="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Ceritakan kepuasan Anda mengenai riasan MBell MakeUp..."
                  className="w-full px-4 py-3 rounded-xl bg-mbell-canvas border border-mbell-border text-sm font-sans text-mbell-ink placeholder:text-mbell-muted/60 focus:outline-none focus:ring-2 focus:ring-mbell-rose/30 focus:border-mbell-rose transition-all resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Photo Upload (Optional) */}
              <div>
                <label className="block text-xs font-sans font-medium text-mbell-ink mb-1.5">
                  Foto Hasil Riasan (Opsional)
                </label>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-mbell-surface border border-mbell-border">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-lg border border-dashed border-mbell-border bg-mbell-canvas flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-mbell-rose transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mbell-muted">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-sans font-medium text-mbell-primary hover:text-mbell-ink underline"
                    >
                      {file ? 'Ganti Foto' : 'Pilih Foto dari Galeri'}
                    </button>
                    <p className="text-[11px] text-mbell-muted mt-0.5">Format JPG/PNG, maks 10MB</p>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full min-h-[48px] rounded-full bg-mbell-primary text-mbell-canvas font-sans font-medium text-sm flex items-center justify-center hover:bg-mbell-ink transition-colors shadow-sm disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Kirim Testimoni'
                )}
              </button>

            </form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TestimonialForm;