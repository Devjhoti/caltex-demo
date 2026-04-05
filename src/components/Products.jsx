import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_LIST = [
  { img: 'Caltex Techron.png', name: 'CALTEX TECHRON', category: 'Fuel Additive', desc: 'Unleash maximum power with complete engine deposit control.\nOptimize fuel economy and restore lost performance.' },
  { img: 'Havoline Pro DS.png', name: 'HAVOLINE PRO DS', category: 'Engine Oil', desc: 'Advanced synthetic shield for ultimate engine protection.\nEngineered for extreme temperatures and severe driving.' },
  { img: 'Havoline Super 4T.png', name: 'HAVOLINE SUPER 4T', category: '4-Stroke Engine Oil', desc: 'Reliable daily commuter protection for 4-stroke motorcycles.\nMaintains smooth gear shifts and clutch control.' },
  { img: 'Havoline Super 4T Semi Synthetic.png', name: 'HAVOLINE SEMI SYNTH', category: 'Semi Synthetic', desc: 'Enhanced thermal stability for high-performance riding.\nSuperior wear protection under heavy loads.' },
  { img: 'Havoline Coolant Premix.png', name: 'HAVOLINE COOLANT', category: 'Coolant', desc: 'Ready-to-use extended life antifreeze protection.\nPrevents overheating and guards against corrosion.' }
];

export default function Products() {
  const [showCatalogue, setShowCatalogue] = useState(false);
  const containerRef = useRef(null);
  const stickyWrapperRef = useRef(null);
  const sceneRef = useRef(null);
  
  const productCardRefs = useRef([]);
  const textContainerRefs = useRef([]);
  const titleRefs = useRef([]);
  const badgeRefs = useRef([]);
  const descRefs = useRef([]);
  
  const activeIdxRef = useRef(-1);

  const zStep = 1500;
  const totalProducts = PRODUCT_LIST.length;

  useEffect(() => {
    const animateIn = (idx) => {
      if (idx < 0 || idx >= totalProducts) return;
      if (!textContainerRefs.current[idx]) return;
      
      gsap.to(textContainerRefs.current[idx], { opacity: 1, duration: 0.1 });
      gsap.fromTo(titleRefs.current[idx], { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', overwrite: 'auto' });
      gsap.fromTo(badgeRefs.current[idx], { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', overwrite: 'auto' });
      gsap.fromTo(descRefs.current[idx], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out', overwrite: 'auto' });
    };

    const animateOut = (idx) => {
      if (idx < 0 || idx >= totalProducts) return;
      if (!textContainerRefs.current[idx]) return;
      gsap.to(textContainerRefs.current[idx], { opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: () => {
          if (!sceneRef.current) return;
          const currentZ = gsap.getProperty(sceneRef.current, "z") || 0;
          let newIdx = Math.round(currentZ / zStep);
          newIdx = gsap.utils.clamp(0, totalProducts - 1, newIdx);
          
          // Strict CSS Compositing Boundary: 
          // Chromium occasionally crashes dumping layout into a white screen if heavy backdrop filters clip the near camera lens.
          productCardRefs.current.forEach((card, i) => {
             if (!card) return;
             const worldZ = currentZ - (i * zStep);
             if (worldZ > 800) {
                 gsap.set(card, { autoAlpha: 0 }); // drop visibility
             } else {
                 gsap.set(card, { autoAlpha: 1 });
             }
          });

          const distance = Math.abs((currentZ / zStep) - newIdx);
          
          if (distance < 0.2) { 
             if (activeIdxRef.current !== newIdx) {
                animateOut(activeIdxRef.current);
                activeIdxRef.current = newIdx;
                animateIn(newIdx);
             }
          } else {
             if (activeIdxRef.current !== -1) {
                animateOut(activeIdxRef.current);
                activeIdxRef.current = -1;
             }
          }
        }
      }
    });

    // Timeline construction representing the forward walk with visual spacing pins
    for(let i = 0; i < totalProducts - 1; i++) {
       // Wait / "Pin" on current product momentarily
       tl.to(sceneRef.current, { z: i * zStep, duration: 0.3 }); 
       // Move to next product quickly
       tl.to(sceneRef.current, { z: (i + 1) * zStep, duration: 1.2, ease: "power2.inOut" });
    }
    // Final wait on the last product to match formatting cleanly
    tl.to(sceneRef.current, { z: (totalProducts - 1) * zStep, duration: 0.3 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="products-section" ref={containerRef} style={{ height: '700vh', width: '100%', position: 'relative', zIndex: 20 }}>
      
      <div 
        ref={stickyWrapperRef} 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          width: '100%', 
          background: '#CBD0D2', 
          overflow: 'hidden' 
        }}
      >
        <style>
        {`
          .global-shop-btn:hover {
            background-color: #014B60 !important;
            color: #CBD0D2 !important;
          }
        `}
      </style>

      {/* Background Ambience Title */}
      <h2 style={{ position: 'absolute', top: '5vh', left: 0, right: 0, textAlign: 'center', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: 'clamp(2rem, 3vw, 4rem)', fontWeight: 900, color: '#014B60', opacity: 0.1, textTransform: 'uppercase', letterSpacing: '0.4em', pointerEvents: 'none', margin: 0 }}>
        EXHIBITION HALL
      </h2>

      {/* 3D Scene Container */}
      <div style={{ width: '100%', height: '100%', perspective: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Moving Z-Axis Scene */}
        <div ref={sceneRef} style={{ width: '100vw', height: '100vh', transformStyle: 'preserve-3d', position: 'relative' }}>
          
          {PRODUCT_LIST.map((prod, i) => (
            <div 
              key={i} 
              ref={el => productCardRefs.current[i] = el}
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%',
                // Each product is placed exactly zStep pixels deeper into the screen and rotated softly
                transform: `translate(-50%, -50%) translateZ(${-i * zStep}px) rotateY(${i % 2 === 0 ? '-3deg' : '3deg'})`,
                display: 'flex',
                alignItems: 'center',
                gap: '4rem',
                width: '80%',
                justifyContent: 'center',
                transformStyle: 'preserve-3d'
              }}
            >
              
              {/* Product Visual */}
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                <img src={`/products/${prod.img}`} alt={prod.name} style={{ height: '50vh', objectFit: 'contain' }} />
              </div>

              {/* Text Block associated strictly with the product coordinates physically floating in 3D */}
              <div 
                ref={el => textContainerRefs.current[i] = el}
                style={{ width: '450px', display: 'flex', flexDirection: 'column', opacity: 0 }}
              >
                <div 
                  ref={el => badgeRefs.current[i] = el}
                  style={{ background: '#014B60', color: '#CBD0D2', padding: '6px 16px', borderRadius: '50px', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', width: 'fit-content' }}
                >
                  {prod.category}
                </div>
                
                <h2 
                  ref={el => titleRefs.current[i] = el}
                  style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontWeight: 900, color: '#014B60', fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: 0, textTransform: 'uppercase', lineHeight: 1.1 }}
                >
                  {prod.name}
                </h2>
                
                <p 
                  ref={el => descRefs.current[i] = el}
                  style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", color: '#014B60', fontWeight: 400, fontSize: '1.3rem', whiteSpace: 'pre-line', marginTop: '1.5rem', lineHeight: 1.4 }}
                >
                  {prod.desc}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Global Shop Now Hub Control */}
      <div style={{ position: 'absolute', bottom: '4vh', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50 }}>
        <button 
          className="global-shop-btn"
          onClick={() => setShowCatalogue(true)}
          style={{ 
            fontFamily: "'ITC Franklin Gothic LT', sans-serif", 
            border: '2px solid #014B60', 
            background: 'transparent', 
            color: '#014B60', 
            padding: '16px 48px', 
            fontWeight: 900, 
            fontSize: '1.2rem', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '4px'
          }}
        >
          VIEW CATALOGUE
        </button>
      </div>

      </div> 
      {/* End Sticky Wrapper */}

      {/* Full CSS Sleek Catalogue Overlay Modal */}
      {showCatalogue && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(1,75,96,0.98)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <button 
            onClick={() => setShowCatalogue(false)} 
            style={{ position: 'absolute', top: '2rem', right: '3rem', background: 'none', border: 'none', color: '#FFF', fontSize: '3rem', cursor: 'pointer', padding: '1rem' }}
          >
            ×
          </button>
          
          <h2 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '3rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '0.2em' }}>
            PRODUCT CATALOGUE
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2rem', width: '90%', maxWidth: '1400px' }}>
            {PRODUCT_LIST.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={`/products/${p.img}`} alt={p.name} style={{ height: '160px', objectFit: 'contain', marginBottom: '1.5rem' }} />
                <h3 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1rem', fontWeight: 900, margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{p.name}</h3>
                <div style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '0.8rem', color: '#CBD0D2', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
