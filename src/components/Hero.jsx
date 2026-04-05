import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 168;

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const heroWrapperRef = useRef(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);
  const playhead = { frame: 0 };

  useEffect(() => {
    let loadedCount = 0;
    const images = [];
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[playhead.frame];
    
    if (img && img.complete) {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderCanvas();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    renderCanvas();

    const st = gsap.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          renderCanvas();
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        }
      }
    });

    // Copy Blocks Sequence (Time-Based GSAP Tweens)
    const copyBlocks = gsap.utils.toArray('.copy-block');
    copyBlocks.forEach((block, i) => {
      const startProgress = i * 0.23 + 0.02; // Minor offset
      const endProgress = startProgress + 0.18;
      const isLast = i === copyBlocks.length - 1;
      
      const h2 = block.querySelector('h2');
      const p = block.querySelector('p');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: `${startProgress * 100}% top`,
          end: `${endProgress * 100}% top`,
          toggleActions: isLast ? "play none none reverse" : "play reverse play reverse",
        }
      });

      // 1) Block background fade in
      tl.fromTo(block,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        0 // sync at start
      )
      // 2) Clean Opacity + Y Text Reveal
      .fromTo([h2, p], 
        { 
          opacity: 0, 
          y: 40 
        }, 
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
        },
        0 // sync at start
      );
    });

    // Fade out canvas and text right at the very end to seamlessly handoff to next section
    gsap.to(heroWrapperRef.current, {
      opacity: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '95% top',
        end: '100% top',
        scrub: true,
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [imagesLoaded]);

  return (
    <>
      <div 
        ref={containerRef} 
        style={{ 
          height: '700vh', 
          position: 'relative',
          backgroundColor: 'var(--white)'
        }}
      >
        <div 
          ref={heroWrapperRef}
          className="canvas-wrapper" 
          style={{ 
            position: 'sticky', 
            top: 0, 
            height: '100vh', 
            overflow: 'hidden' 
          }}
        >
          <canvas ref={canvasRef} style={{ display: 'block', backgroundColor: 'var(--white)' }} />
          
          <div className="copy-block" style={copyBlockStyle}>
            <h2 style={blockTitleStyle}>ENGINEERED FOR EXCELLENCE</h2>
            <p style={blockTextStyle}>
              Introducing Caltex Havoline 4T.<br/>
              Every drop protects, performs, and powers your journey.
            </p>
          </div>
          
          <div className="copy-block" style={copyBlockStyle}>
            <h2 style={blockTitleStyle}>UNCOMPROMISING PROTECTION</h2>
            <p style={blockTextStyle}>
              Advanced friction modifiers deliver smooth clutch control<br/>
              and seamless gear shifts under all conditions.
            </p>
          </div>
          
          <div className="copy-block" style={copyBlockStyle}>
            <h2 style={blockTitleStyle}>PROVEN PERFORMANCE</h2>
            <p style={blockTextStyle}>
              Cleans and protects vital engine parts, ensuring maximum<br/>
              power output and long-term durability.
            </p>
          </div>
          
          <div className="copy-block" style={copyBlockStyle}>
            <h2 style={blockTitleStyle}>RIDE WITH CONFIDENCE</h2>
            <p style={blockTextStyle}>
              Enjoy the journey.<br/>
              Unearth the true potential of your engine with Caltex.
            </p>
          </div>

          <div 
            ref={progressBarRef}
            className="progress-bar"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '6px',
              backgroundColor: 'var(--red)',
              width: '0%',
              zIndex: 10,
              boxShadow: '0 0 10px var(--red)'
            }}
          />
        </div>
      </div>
    </>
  );
}

const copyBlockStyle = {
  position: 'absolute',
  top: '50%',
  left: '8%',
  transform: 'translateY(-50%)',
  maxWidth: '600px',
  opacity: 0, 
  color: 'var(--teal)',
  pointerEvents: 'none',
  padding: '3rem',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
  borderRadius: '8px'
};

const blockTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: 900,
  textTransform: 'uppercase',
  marginBottom: '1rem',
  color: 'var(--red)',
  lineHeight: 1.1,
  textShadow: '0 2px 10px rgba(255,255,255,0.8)'
};

const blockTextStyle = {
  fontSize: '1.4rem',
  fontWeight: 600,
  color: 'var(--teal)',
  lineHeight: 1.6,
};
