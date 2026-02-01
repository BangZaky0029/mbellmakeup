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
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
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
          is_approved: true // Auto-approve as per current flow requirements
        }]);

      if (insertError) throw insertError;

      setStatus('success');
      setFormData({ name: '', role: '', content: '' });
      setRating(5);
      setFile(null);
      setPreview(null);
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengirim testimoni.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 } as any}
        whileInView={{ opacity: 1, y: 0 } as any}
        viewport={{ once: true } as any}
        className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-primary/5"
      >
        <div className="text-center mb-10">
          <h3 className="font-serif text-4xl text-textMain mb-3">Share Your Experience</h3>
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
              className="space-y-8"
              initial={{ opacity: 1 } as any}
              exit={{ opacity: 0 } as any}
            >
              <div className="space-y-6">
                {/* Star Rating Selection */}
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em] ml-1">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Bella Aprillian"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans"
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
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans"
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
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-sans resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-textMain/50 uppercase tracking-[0.2em] ml-1">Foto Hasil Makeup (Opsional)</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-gray-50/50 border border-dashed border-gray-200">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-44 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-white transition-all bg-white shadow-sm overflow-hidden group"
                    >
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mx-auto mb-2 group-hover:text-primary transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          <p className="text-[8px] font-bold text-textMain/30 uppercase tracking-widest">Upload 9:16 Photo</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                       <h5 className="font-serif text-lg text-textMain mb-1">Pilih Foto Terbaik Anda</h5>
                       <p className="text-[10px] text-textMain/40 leading-relaxed max-w-xs">Pastikan foto dalam orientasi tegak (portrait) untuk hasil tampilan yang lebih elegan.</p>
                       <input 
                         type="file" 
                         ref={fileInputRef}
                         onChange={handleFileChange}
                         accept="image/*"
                         className="hidden"
                       />
                       {file && (
                         <button 
                           type="button" 
                           onClick={() => {setFile(null); setPreview(null);}}
                           className="mt-4 px-4 py-1.5 rounded-full border border-red-100 text-[9px] text-red-400 font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                         >
                           Hapus Foto
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-red-500 text-xs text-center font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                disabled={status === 'loading'}
                className="w-full h-16 shadow-xl flex items-center justify-center gap-3 text-base"
              >
                {status === 'loading' ? (
                   <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Publikasikan Testimoni</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TestimonialForm;