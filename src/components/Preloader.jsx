import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const ringRef = useRef(null);
  const counterRef = useRef(null);
  const taglineRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    let progressObj = { val: 0 };
    const tl = gsap.timeline();

    tl.to(progressObj, {
      val: 100,
      duration: 3,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = Math.round(progressObj.val);
        setProgress(val);
        
        // SVG dashoffset calculation (Radius 300 -> Circumference ~1885)
        if (ringRef.current) {
          const dashOffset = 1885 - (1885 * val) / 100;
          ringRef.current.style.strokeDashoffset = dashOffset;
        }

        if (val === 50 && taglineRef.current.style.opacity == 0) {
          gsap.to(taglineRef.current, { opacity: 1, duration: 0.8, y: 0, ease: "power2.out" });
        }
      },
      onComplete: () => {
        // Exit sequence
        const exitTl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        // 1. Ring, counter, and tagline fade
        exitTl.to([ringRef.current, counterRef.current, taglineRef.current], {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut"
        }, 0)
        // 2. White overlay and logo fade out simultaneously
        .to([bgRef.current, logoRef.current], {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut"
        }, 0.5);
      }
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* White Background Layer */}
      <div 
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          zIndex: -1
        }}
      />

      <div style={{ position: 'relative', width: '620px', height: '620px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Logo */}
        <img 
          ref={logoRef}
          src="/logos/Caltex-Woodmark(Circular).png" 
          alt="Caltex Loading"
          style={{
            position: 'absolute',
            width: '578px',
            height: '578px',
            objectFit: 'contain',
            borderRadius: '50%'
          }} 
        />
        
        {/* SVG Ring */}
        <svg 
          width="620" 
          height="620" 
          viewBox="0 0 620 620" 
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          <circle 
            cx="310" cy="310" r="300" 
            fill="none" 
            stroke="rgba(0, 0, 0, 0.05)" 
            strokeWidth="6" 
          />
          <circle 
            ref={ringRef}
            cx="310" cy="310" r="300" 
            fill="none" 
            stroke="var(--red)" 
            strokeWidth="6" 
            strokeDasharray="1885"
            strokeDashoffset="1885"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Percentage */}
      <div 
        ref={counterRef}
        style={{
          color: 'var(--teal)',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginTop: '1rem',
          letterSpacing: '0.1em'
        }}
      >
        {progress}%
      </div>

      {/* Tagline */}
      <div 
        ref={taglineRef}
        style={{
          color: 'var(--teal)',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginTop: '0.5rem',
          opacity: 0,
          transform: 'translateY(10px)',
          fontStyle: 'italic'
        }}
      >
        "Enjoy the journey."
      </div>
    </div>
  );
}
