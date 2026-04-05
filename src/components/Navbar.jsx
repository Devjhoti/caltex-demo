import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar({ cartCount = 0, setIsCartOpen }) {
  const navRef = useRef(null);
  const cartIconRef = useRef(null);

  useEffect(() => {
    gsap.to(navRef.current, {
      backgroundColor: 'rgba(181, 196, 201, 0.95)', // var(--teal) as sleek dark
      color: 'var(--teal)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      duration: 0.5,
      scrollTrigger: {
        trigger: '.next-section',
        start: 'top 80px',
        toggleActions: 'play none none reverse'
      }
    });

    // We can also change the links color safely by changing CSS variables or relying on currentColor
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        zIndex: 1000,
        color: 'var(--teal)', // initially dark teal text because hero is white
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logos/navbar-logo.png"
          alt="Caltex"
          style={{ height: '40px', objectFit: 'contain' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '3rem', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', alignItems: 'center' }}>
        <style>
          {`
            .nav-link {
              position: relative;
              text-decoration: none;
              color: inherit;
              cursor: pointer;
              padding-bottom: 4px;
            }
            .nav-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 2px;
              display: block;
              bottom: 0;
              left: 50%;
              background: #FF0000;
              transition: width 0.3s ease, left 0.3s ease;
            }
            .nav-link:hover::after {
              width: 100%;
              left: 0;
            }
          `}
        </style>

        <a className="nav-link" onClick={() => window.dispatchEvent(new Event('openCatalogue'))}>Products</a>
        <a className="nav-link" onClick={() => window.lenis?.scrollTo('#news-section')}>News</a>
        <a className="nav-link" onClick={() => window.lenis?.scrollTo('bottom')}>Locate Us</a>
        
        <div 
          id="cart-icon"
          ref={cartIconRef}
          onClick={() => setIsCartOpen(true)}
          style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              backgroundColor: '#FF0000',
              color: '#fff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              {cartCount}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
