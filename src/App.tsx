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

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Abstract Background Layer */}
      <FlowerBackground />

      {/* Background Music */}
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
    </div>
  );
}

export default App;