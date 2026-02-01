import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';

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
        alert("File size must be less than 10MB");
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
          role: formData.role,
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
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengirim testimoni.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 } as any}
        animate={{ opacity: 1, scale: 1 } as any}
        className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-primary/10"
      >
        <div className="text-center mb-10">
          <h3 className="font-serif text-3xl md:text-4xl text-textMain mb-3">Share Your Experience</h3>
          <p className="text-textMain/50 text-sm font-sans italic tracking-wide">Momen bahagia Anda adalah inspirasi kami 💖</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 } as any}
              animate={{ opacity: 1, scale: 1 } as any}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h4 className="font-serif text-3xl text-textMain mb-4">Terima Kasih Cantik!</h4>
              <p className="text-textMain/70 font-sans text-lg mb-10">Testimoni Anda telah dipublikasikan di galeri kami! ✨</p>
              <Button 
                variant="outline" 
                className="px-12 py-4" 
                onClick={() => setStatus('idle')}
              >
                Kirim Testimoni Lain
              </Button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleSubmit} 
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 1 } as any}
              exit={{ opacity: 0 } as any}
            >
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <label className="text-[10px] font-bold text-textMain/40 uppercase tracking-[0.3em]">Berikan Rating Anda</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="transition-all duration-200 hover:scale-125 focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="36" 
                          height="36" 
                          viewBox="0 0 24 24" 
                          fill={(hoverRating || rating) >= star ? "#FFD700" : "none"} 
                          stroke={(hoverRating || rating) >= star ? "#FFD700" : "#E5E7EB"}
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-serif italic text-textMain/30">Ketuk bintang untuk memberi nilai</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em] ml-1">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Bella Aprillian"
                      className="w-full px-5 md:px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em] ml-1">Tipe Event</label>
                    <input 
                      type="text" 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Contoh: Wedding / Graduation"
                      className="w-full px-5 md:px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em] ml-1">Testimoni Anda *</label>
                  <textarea 
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Ceritakan pengalaman tak terlupakan Anda menggunakan jasa MBell Makeup..."
                    className="w-full px-5 md:px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em]">Foto Hasil Makeup (Opsional)</label>
                    <span className="text-[9px] text-textMain/30 uppercase tracking-widest italic">Portrait 9:16 disarankan</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 md:p-6 rounded-[2rem] bg-gray-50/50 border border-dashed border-gray-200 hover:bg-white/50 transition-colors">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-40 md:w-32 md:h-44 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-white transition-all bg-white shadow-sm overflow-hidden group relative"
                    >
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mx-auto mb-2 group-hover:text-primary transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          <p className="text-[8px] font-bold text-textMain/30 uppercase tracking-widest">Upload Photo</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                       <h5 className="font-serif text-lg text-textMain mb-1">Pilih Foto Terbaik Anda</h5>
                       <p className="text-[10px] text-textMain/40 leading-relaxed max-w-xs mb-3">Jika tidak diunggah, kami akan menampilkan pesan rindu di galeri kami. 😊</p>
                       <input 
                         type="file" 
                         ref={fileInputRef}
                         onChange={handleFileChange}
                         accept="image/*"
                         className="hidden"
                       />
                       <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                         <button 
                           type="button" 
                           onClick={() => fileInputRef.current?.click()}
                           className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[9px] text-textMain font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                         >
                           {file ? 'Ganti Foto' : 'Pilih Foto'}
                         </button>
                         {file && (
                           <button 
                             type="button" 
                             onClick={() => {setFile(null); setPreview(null);}}
                             className="px-4 py-1.5 rounded-full border border-red-100 text-[9px] text-red-400 font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                           >
                             Hapus Foto
                           </button>
                         )}
                       </div>
                       <p className="mt-3 text-[9px] text-textMain/30 uppercase tracking-widest">Maksimal 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-red-500 text-xs text-center font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={status === 'loading'}
                  className="w-full h-14 md:h-16 shadow-[0_15px_35px_-5px_rgba(212,165,165,0.4)] flex items-center justify-center gap-3 text-base group overflow-hidden"
                >
                  {status === 'loading' ? (
                     <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Publikasikan Testimoni</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:scale-110"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TestimonialForm;