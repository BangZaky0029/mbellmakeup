import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import PriceList from './components/PriceList';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FlowerBackground from './components/ui/FlowerBackground';
import MusicPlayer from './components/ui/MusicPlayer';
import Button from './components/ui/Button';
import logo from './assets/logoBrand.png';
import React, { useState } from 'react';


function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* 
        WELCOME / SOUND ENABLE SCREEN 
        Ditampilkan jika user belum klik 'Enter Experience'
      */}
      <AnimatePresence>
        {!soundEnabled && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center text-center px-6 overflow-hidden"
          >
             {/* Background Element khusus untuk Welcome Screen */}
             <div className="absolute inset-0 z-0 opacity-50">
                <FlowerBackground />
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="relative z-10 max-w-md w-full"
             >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/30 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <img src={logo} alt="Logo" className="w-20 h-25" />
                    </div>
                  </div>
                </div>

                <h1 className="font-serif text-4xl md:text-6xl text-textMain mb-3 tracking-wide">
                  MBell MakeUp
                </h1>
                
                <div className="h-[1px] w-24 bg-primary mx-auto mb-6"></div>

                <p className="font-sans text-textMain/60 text-sm md:text-base tracking-widest uppercase mb-10 leading-relaxed">
                  Enhancing Natural Beauty<br/>with a touch of elegance
                </p>

                <p className="font-sans text-xs text-textMain/40 mb-6 italic">
                  * For the best experience, please enable sound
                </p>

                <div className="flex justify-center">
                  <Button 
                    variant="primary" 
                    onClick={() => setSoundEnabled(true)}
                    className="shadow-xl"
                  >
                    Enter Experience
                  </Button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        MAIN CONTENT 
        Hanya dirender (atau setidaknya MusicPlayer aktif) setelah soundEnabled = true 
      */}
      {soundEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Abstract Background Layer */}
          <FlowerBackground />

          {/* Background Music - Will auto-play successfully because rendered after click */}
          <MusicPlayer />

          {/* Main Content Layer */}
          <Navbar />
          
          <main className="relative">
            <Hero />
            
            {/* Spacer for visual rhythm */}
            <div className="h-10 md:h-20"></div>
            
            <About />

            {/* Spacer */}
            <div className="h-10 md:h-20"></div>
            
            <Portfolio />

            <div className="h-10 md:h-20"></div>
            
            <Testimonials />

            <div className="h-10 md:h-20"></div>

            <PriceList />

            <div className="h-10 md:h-20"></div>

            <Contact />
            
            {/* Spacer */}
            <div className="h-20"></div>
          </main>

          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default App;