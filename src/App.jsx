import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/Preloader';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import WhoWeAre from './components/WhoWeAre';
import Products from './components/Products';
import News from './components/News';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import CartModal from './components/CartModal';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [preloading, setPreloading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
      <Navbar cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} setIsCartOpen={setIsCartOpen} />
      <Hero />
      <WhoWeAre />
      <Products setCartItems={setCartItems} setIsCheckoutOpen={setIsCheckoutOpen} />
      <News />
      <Footer />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
        onProceed={() => setIsCheckoutOpen(true)}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartItems={cartItems} 
      />
    </div>
  );
}

export default App;
