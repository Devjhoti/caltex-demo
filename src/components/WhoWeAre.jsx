import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhoWeAre() {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const copyRef = useRef(null);
  const lineRef = useRef(null);

  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);

  useEffect(() => {
    // 1) Continuous 3D rotation for logo
    gsap.to(logoImgRef.current, {
      rotationY: 360,
      repeat: -1,
      ease: 'none',
      duration: 8
    });

    // 2) Gentle float breathing
    gsap.to(logoWrapperRef.current, {
      y: -20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 3
    });

    console.log("Timeline Targets - Words:", wordsRef.current);
    console.log("Timeline Targets - Copy:", copyRef.current);
    console.log("Timeline Targets - Line:", lineRef.current);

    // 3) Entrance Animation Sequence (MUST be defined before Pin)
    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        toggleActions: 'play none none none',
      }
    });

    enterTl.to(wordsRef.current, {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.4,
      stagger: 0.2,
      ease: 'power4.out'
    })
      .to(copyRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '+=0.1')
      .to(lineRef.current, {
        scaleY: 1,
        duration: 0.8,
        ease: 'power3.out'
      }, '+=0.2');

    // 4) Pinning behavior
    const pin = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      anticipatePin: 1
    });

    // 5) Outro cinematic fade exactly like Hero
    const exitTl = gsap.to(containerRef.current, {
      opacity: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top -80%',
        end: 'top -100%',
        scrub: true
      }
    });

    return () => {
      pin.kill();
      enterTl.scrollTrigger?.kill();
      enterTl.kill();
      exitTl.scrollTrigger?.kill();
      exitTl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="next-section"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#CBD0D2',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10,
        display: 'flex'
      }}
    >
      {/* Left Side - 2D Logo Elements (55%) */}
      <div style={{ width: '50%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Soft Radial Glow */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(1,75,96,0.2) 0%, rgba(203,208,210,0) 65%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }} />

        {/* Floating Logo Complex */}
        <div style={{ position: 'relative', perspective: '1200px' }}>
          <div ref={logoWrapperRef} style={{ pointerEvents: 'none' }}>
            <img
              ref={logoImgRef}
              src="/logos/Caltex-Woodmark(Circular).png"
              alt="Caltex Woodmark"
              style={{
                width: '380px',
                height: 'auto',
                transformStyle: 'preserve-3d'
              }}
            />
          </div>

          {/* Shadow Ellipse directly below */}
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '50%',
            filter: 'blur(10px)',
            pointerEvents: 'none'
          }} />
        </div>
      </div>

      {/* Right Side - Typography (45%) */}
      <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '2rem' }}>

        <div style={{ display: 'flex', height: 'fit-content' }}>
          {/* Thin Red Accent */}
          <div
            ref={lineRef}
            style={{
              width: '3px',
              backgroundColor: 'var(--red)',
              marginRight: '2.5rem',
              transformOrigin: 'top center',
              transform: 'scaleY(0)' // Starts completely hidden
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{
              fontFamily: "'ITC Franklin Gothic LT', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(5rem, 9vw, 9rem)',
              color: '#014B60',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: 0
            }}>
              {["WHO", "ARE", "WE?"].map((word, i) => (
                <div key={i} style={{ paddingBottom: '0.1em' }}>
                  <div
                    ref={el => wordsRef.current[i] = el}
                    style={{ transform: 'translateX(800px)', opacity: 0, filter: 'blur(20px)' }}
                  >
                    {word}
                  </div>
                </div>
              ))}
            </h2>

            <p
              ref={copyRef}
              style={{
                fontFamily: "'ITC Franklin Gothic LT', sans-serif",
                fontWeight: 400,
                color: '#014B60',
                fontSize: '1.25rem',
                maxWidth: '420px',
                lineHeight: 1.7,
                marginTop: '2.5rem',
                opacity: 0 // Starts hidden
              }}
            >
              Caltex has been fueling journeys across Bangladesh for decades.<br />
              From city commutes to open highways, we deliver precision-engineered lubricants that protect engines and push performance further.<br /><br />
              We are not just a fuel brand — we are part of every journey.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
