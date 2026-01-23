import React from 'react';
import { motion } from 'framer-motion';
import me from '../assets/bella_1.webp';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-md mx-auto rounded-t-full rounded-b-[200px] overflow-hidden shadow-2xl">
              <img 
                src={me}
                alt="Bella Aprillian - Makeup Artist" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay"></div>
            </div>
            
            {/* Decorative Elements around image */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute top-12 -right-8 w-40 h-40 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 text-left"
          >
            <span className="text-primary font-sans font-bold tracking-widest uppercase text-sm mb-4 block">
              The Artist
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-textMain mb-8 leading-tight">
              About Me
            </h2>
            
            <div className="font-sans text-textMain/70 leading-relaxed space-y-6 text-lg">
              <p>
                Selamat datang di <span className="font-serif font-bold text-primary">MBELL!</span> Saya Bella Aprillian, seorang makeup artist yang berdedikasi untuk menonjolkan kecantikan alami Anda dan membuat Anda merasa percaya diri di setiap momen spesial dalam hidup Anda.
              </p>
              <p>
                Dengan pengalaman bertahun-tahun dalam makeup pengantin, acara spesial, dan pemotretan profesional, saya mengkhususkan diri dalam menciptakan tampilan yang timeless sekaligus modern. Setiap wajah memiliki cerita unik, dan saya di sini untuk membuat Anda bersinar di hari-hari terpenting Anda.
              </p>
              <p>
                Pendekatan saya menggabungkan teknik profesional dengan sentuhan personal, memastikan Anda tidak hanya tampil cantik tetapi juga merasa luar biasa.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif italic font-bold text-xl">
                 BA
               </div>
               <div>
                 <p className="font-serif text-xl text-textMain">Bella Aprillian</p>
                 <p className="font-sans text-sm text-textMain/50 tracking-wider uppercase">Professional MUA</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;