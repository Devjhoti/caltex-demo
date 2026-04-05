import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/Preloader';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import WhoWeAre from './components/WhoWeAre';
import Products from './components/Products';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [preloading, setPreloading] = useState(true);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    window.lenis = lenis; // Expose globally for cross-section programmatic scroll logic

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      window.lenis = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>
      {preloading && <Preloader onComplete={() => setPreloading(false)} />}
      
      {/* We mount these to allow canvas/assets to begin loading while preloader shows */}
      <Navbar />
      <Hero />
      <WhoWeAre />
      <Products />
    </div>
  );
}

export default App;
