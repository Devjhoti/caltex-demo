import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/Preloader';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import WhoWeAre from './components/WhoWeAre';

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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
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

      {/* New Placeholder */}
      <section 
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a', 
          color: 'var(--white)',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}
      >
        <h2 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--red)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          More Innovation
        </h2>
        <p style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--gray-light)', maxWidth: '800px', textAlign: 'center', lineHeight: 1.6 }}>
          Continuing the journey across our global brand.
        </p>
        
        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
          <div style={{ width: '300px', height: '400px', backgroundColor: '#111', border: '1px solid #333' }} />
          <div style={{ width: '300px', height: '400px', backgroundColor: '#111', border: '1px solid #333' }} />
          <div style={{ width: '300px', height: '400px', backgroundColor: '#111', border: '1px solid #333' }} />
        </div>
      </section>
    </div>
  );
}

export default App;
