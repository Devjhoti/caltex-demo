import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NEWS_DATA = [
  { id: 1, title: 'Chevron Bangladesh Achieves Zero Incidents', date: 'October 15, 2026', type: 'CORPORATE', img: '/products/Havoline Pro DS.png', desc: 'Setting new industry standards in operational safety and excellence across all major plants.' },
  { id: 2, title: 'Caltex Havoline ProDS Relaunched', date: 'September 28, 2026', type: 'PRODUCT', img: '/products/Havoline Pro DS.png', desc: 'The new advanced formulation offers ultimate engine protection under extreme thermal load.' },
  { id: 3, title: 'Formula 1 Global Partnership', date: 'August 12, 2026', type: 'MOTORSPORT', img: '/logos/Caltex-Woodmark(Circular).png', desc: 'Caltex solidifies its presence on the track with a multi-year global racing partnership.' },
  { id: 4, title: 'Techron Tech Center Opened', date: 'July 05, 2026', type: 'INNOVATION', img: '/products/Caltex Techron.png', desc: 'A multi-million dollar R&D facility focusing on next-generation fuel additives opens in Dhaka.' },
  { id: 5, title: 'Sustainability Goals 2030', date: 'June 20, 2026', type: 'GREEN FOCUS', img: '/products/Havoline Super 4T Semi Synthetic.png', desc: 'Driving a greener future with aggressive carbon reduction and recycled packaging initiatives.' },
  { id: 6, title: 'Super 4T Motorcycle Rally', date: 'May 14, 2026', type: 'EVENT', img: '/products/Havoline Super 4T.png', desc: 'Over 500 riders participated in the cross-country rally powered by Havoline Super 4T.' }
];

export default function News() {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Scroll-driven entry for the section
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.5, scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'bottom bottom'
      }}
    );

    // Interactive 3D Spinning logic
    let rotation = 0;
    const items = gsap.utils.toArray('.news-card');
    
    // Auto rotation loop
    const autoSpin = gsap.to(carouselRef.current, {
      rotationY: 360,
      duration: 30,
      ease: 'none',
      repeat: -1
    });

    // Pause on hover
    carouselRef.current.addEventListener('mouseenter', () => autoSpin.pause());
    carouselRef.current.addEventListener('mouseleave', () => autoSpin.play());

    return () => {
      autoSpin.kill();
    };
  }, []);

  return (
    <section 
      id="news-section"
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: '#001a24', 
        color: '#FFF', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        padding: '6rem 0',
        zIndex: 5
      }}
    >
      {/* Dynamic Background Noise/Gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -20%, rgba(1,75,96,0.6) 0%, transparent 60%)', opacity: 0.8, pointerEvents: 'none' }} />

      <h2 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', zIndex: 10, textAlign: 'center' }}>
        <span style={{ color: '#FF0000' }}>LATEST</span> INTEL
      </h2>
      <p style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1.2rem', color: '#88a3ab', maxWidth: '600px', textAlign: 'center', marginBottom: '6rem', zIndex: 10, lineHeight: 1.6 }}>
        Stay updated with our newest innovations, global motorsport developments, and corporate milestones driving the industry forward.
      </p>

      {/* 3D Cylinder Viewport */}
      <div style={{ perspective: '2000px', width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Rotating Cylinder Pivot */}
        <div 
          ref={carouselRef} 
          style={{ 
            position: 'relative', 
            width: '400px', 
            height: '450px', 
            transformStyle: 'preserve-3d',
            cursor: 'grab' 
          }}
        >
          
          {NEWS_DATA.map((news, i) => {
            const angle = (360 / NEWS_DATA.length) * i;
            const radius = 550; // The distance items push outward to form the cylinder

            return (
              <div 
                key={news.id}
                className="news-card"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '400px',
                  height: '450px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(1, 75, 96, 0.6)';
                  e.currentTarget.style.border = '1px solid rgba(1, 75, 96, 0.8)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Visual Header */}
                <div style={{ height: '220px', background: 'radial-gradient(circle at center, rgba(1,75,96,0.3) 0%, rgba(0,0,0,0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <img src={news.img} alt={news.title} style={{ height: '140px', objectFit: 'contain', zIndex: 2 }} />
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: '#FF0000', color: '#FFF', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', letterSpacing: '0.1em', zIndex: 3 }}>
                    {news.type}
                  </div>
                </div>

                {/* Content Block */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ color: '#014B60', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.5rem', color: '#88a3ab' }}>
                    {news.date}
                  </div>
                  <h3 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1.4rem', fontWeight: 900, margin: '0 0 1rem 0', color: '#FFF', lineHeight: 1.2 }}>
                    {news.title}
                  </h3>
                  <p style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '0.95rem', color: '#CBD0D2', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                    {news.desc}
                  </p>
                  
                  <button style={{ marginTop: 'auto', background: 'transparent', border: 'none', color: '#FF0000', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'ITC Franklin Gothic LT', sans-serif", textTransform: 'uppercase' }}>
                    Read Full Story
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
