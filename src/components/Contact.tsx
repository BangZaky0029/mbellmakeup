import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData(prev => ({ ...prev, address: mapsLink }));
        setIsLoadingLoc(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please type your address manually.");
        setIsLoadingLoc(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const phoneNumber = "6288293473765";
    const text = `Halo MBELL Makeup, saya ingin melakukan reservasi.
    
Nama: ${formData.name}
Layanan: ${formData.service}
Tanggal: ${formData.date}
Alamat/Lokasi: ${formData.address}
Pesan: ${formData.message}

Terima kasih.`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(waUrl, '_blank');
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">Full Name</label>
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
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">Service Interested</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-textMain uppercase tracking-wider">Reservation Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-textMain/70"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-textMain uppercase tracking-wider">Address / Location</label>
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
                      <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    )}
                  </button>
               </div>
               <p className="text-xs text-textMain/50">Click the pin icon to automatically attach your Google Maps location.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-textMain uppercase tracking-wider">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell me more about your event details..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full md:w-auto flex items-center justify-center gap-2">
                <span>Send via WhatsApp</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
              </Button>
            </div>

          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;