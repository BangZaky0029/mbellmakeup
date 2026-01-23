import React from 'react';
import { motion } from 'framer-motion';

// Menggunakan new URL untuk memuat aset gambar secara robust
const price1 = new URL('../assets/price_01.png', import.meta.url).href;
const price2 = new URL('../assets/price_02.png', import.meta.url).href;

const PriceList: React.FC = () => {
  return (
    <section id="pricelist" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
         {/* Section Header */}
         <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-sans font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Investment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-textMain"
          >
            Price List & Packages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-textMain/60 font-sans tracking-wide mt-4 max-w-2xl mx-auto"
          >
            Transparent pricing for your special moments. Choose the package that suits your needs best.
          </motion.p>
        </div>

        {/* Price Images Container */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Price Image 1 */}
            <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="relative group"
            >
                <div className="rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-8 border-white bg-white transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(212,165,165,0.3)]">
                    <img 
                      src={price1} 
                      alt="Price List Package 1" 
                      className="w-full h-auto object-cover" 
                      loading="lazy"
                    />
                </div>
            </motion.div>

            {/* Price Image 2 */}
            <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative group"
            >
                 <div className="rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-8 border-white bg-white transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(212,165,165,0.3)]">
                    <img 
                      src={price2} 
                      alt="Price List Package 2" 
                      className="w-full h-auto object-cover" 
                      loading="lazy"
                    />
                </div>
            </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
           <p className="text-textMain/50 text-sm italic mb-4">
             *Harga dapat berubah sewaktu-waktu. Hubungi kami untuk penawaran khusus.
           </p>
        </div>
      </div>
    </section>
  );
};

export default PriceList;