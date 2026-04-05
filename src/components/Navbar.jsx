import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const navRef = useRef(null);

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

        <a className="nav-link">Products</a>
        <a className="nav-link">Technology</a>
        <a className="nav-link">Locate Us</a>
      </div>
    </nav>
  );
}
