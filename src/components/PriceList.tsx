
import React from 'react';
import { motion } from 'framer-motion';

const price1 = new URL('../assets/price_01.webp', import.meta.url).href;
const price2 = new URL('../assets/price_02.webp', import.meta.url).href;
const price3 = new URL('../assets/akad-makeup.jpeg', import.meta.url).href;

const PriceList: React.FC = () => {
  return (
    <section id="pricelist" className="py-24 relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
         {/* Section Header */}
         <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-sans font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            Investment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-6xl text-textMain mb-6"
          >
            Price List & Packages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-textMain/60 font-sans text-base tracking-wide mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            Quality is our priority. Explore our specialized packages designed to make your special moments truly unforgettable.
          </motion.p>
        </div>

        {/* Price Images Container - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
            {/* Price Image 1 */}
            <motion.div
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="flex justify-center"
            >
                <div className="w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-[12px] border-white bg-white transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_80px_-20px_rgba(212,165,165,0.4)]">
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
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.15 }}
                 className="flex justify-center"
            >
                 <div className="w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-[12px] border-white bg-white transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_80px_-20px_rgba(212,165,165,0.4)]">
                    <img 
                      src={price2} 
                      alt="Price List Package 2" 
                      className="w-full h-auto object-cover" 
                      loading="lazy"
                    />
                </div>
            </motion.div>

            {/* Price Image 3 */}
            <motion.div
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.3 }}
                 className="flex justify-center md:col-span-2 lg:col-span-1"
            >
                 <div className="w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-[12px] border-white bg-white transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_80px_-20px_rgba(212,165,165,0.4)]">
                    <img 
                      src={price3} 
                      alt="Price List Package 3" 
                      className="w-full h-auto object-cover" 
                      loading="lazy"
                    />
                </div>
            </motion.div>
        </div>

        {/* CTA Disclaimer */}
        <div className="text-center mt-16">
           <p className="text-textMain/40 text-xs italic tracking-widest uppercase">
             *Price list updated as of 2024. Prices may vary based on specific requirements and location.
           </p>
        </div>
      </div>
    </section>
  );
};

export default PriceList;
