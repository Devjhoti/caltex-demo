import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#014B60', 
      color: '#CBD0D2', 
      padding: '6rem 4rem 2rem 4rem', 
      fontFamily: "'ITC Franklin Gothic LT', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      
      {/* Massive Background Watermark */}
      <img 
        src="/logos/Caltex-Woodmark(Circular).png" 
        alt="Background Mark" 
        style={{
          position: 'absolute',
          right: '-10%',
          top: '-10%',
          height: '140%',
          opacity: 0.05,
          pointerEvents: 'none',
          transform: 'rotate(-15deg)',
          filter: 'grayscale(100%)'
        }}
      />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '3rem', position: 'relative', zIndex: 1, marginBottom: '4rem', maxWidth: '1600px', margin: '0 auto 4rem auto' }}>
        
        {/* Brand Information */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '150px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            {/* White inverted base logo text mapping */}
            <img 
              src="/logos/navbar-logo.png" 
              alt="Caltex Logo" 
              style={{ width: '100%', filter: 'brightness(0) invert(1)', display: 'block' }} 
            />
            {/* Colored circular overlay blocking the inverted shape */}
            <img 
              src="/logos/Caltex-Woodmark(Circular).png" 
              alt="Caltex Star"
              style={{ 
                position: 'absolute', 
                left: 0, 
                height: '105%', // slight scale to cover perfectly over anti-aliasing bounds
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>
          <p style={{ color: '#88a3ab', lineHeight: 1.6, fontSize: '1.05rem', fontWeight: 400, maxWidth: '85%' }}>
            Empowering your journey with advanced lubrication technology. Engineered for excellence, driven by performance.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Explore</h4>
          {['Products', 'Technology', 'About Us', 'Sustainability'].map(link => (
            <a key={link} href="#" style={{ color: '#88a3ab', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s, transform 0.2s', display: 'flex', width: 'fit-content' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.transform = 'translateX(5px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#88a3ab'; e.currentTarget.style.transform = 'translateX(0)' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Support</h4>
          {['Locate Us', 'Contact', 'FAQs', 'Warranty'].map(link => (
            <a key={link} href="#" style={{ color: '#88a3ab', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s, transform 0.2s', display: 'flex', width: 'fit-content' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.transform = 'translateX(5px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#88a3ab'; e.currentTarget.style.transform = 'translateX(0)' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Stay Updated</h4>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{
                flex: 1, background: 'transparent', border: 'none', padding: '1rem 1.5rem', color: '#FFF', fontSize: '1rem', outline: 'none', fontFamily: "'ITC Franklin Gothic LT', sans-serif"
              }}
            />
            <button 
              style={{
                background: '#FF0000', color: '#FFF', border: 'none', padding: '0 1.5rem', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'ITC Franklin Gothic LT', sans-serif", transition: 'background 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#d00000'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF0000'}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto' }}>
        <p style={{ color: '#6a858d', fontSize: '0.9rem', margin: 0 }}>
          &copy; {new Date().getFullYear()} Chevron Bangladesh. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#" style={{ color: '#6a858d', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
              onMouseLeave={e => e.currentTarget.style.color = '#6a858d'}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
