import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function CartModal({ isOpen, onClose, cartItems, setCartItems, onProceed }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (window.lenis) window.lenis.stop();
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', display: 'flex' });
      gsap.fromTo(containerRef.current, 
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      if (window.lenis) window.lenis.start();
      gsap.to(containerRef.current, { x: '100%', opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: () => {
        if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
      }});
    }
  }, [isOpen]);

  const updateQuantity = (index, delta) => {
    const newItems = [...cartItems];
    newItems[index].quantity += delta;
    if (newItems[index].quantity < 1) {
      newItems.splice(index, 1);
    }
    setCartItems(newItems);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div 
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'none',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        opacity: 0
      }}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'linear-gradient(145deg, #ffffff, #f9fbfb)',
          padding: '2.5rem',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.1)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#014B60', margin: 0, textTransform: 'uppercase' }}>
            Your Cart
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', fontSize: '2rem', color: '#014B60', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0)'}
          >
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#014B60" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1.2rem', color: '#014B60' }}>Your cart is empty.</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', alignItems: 'center' }}>
                <img src={`/products/${item.img}`} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1rem', color: '#014B60', textTransform: 'uppercase', fontWeight: 900 }}>{item.name}</h4>
                  <div style={{ color: '#FF0000', fontWeight: 800, fontSize: '1.1rem' }}>৳{item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f0f4f5', borderRadius: '8px', padding: '0.25rem' }}>
                  <button onClick={() => updateQuantity(idx, -1)} style={{ background: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#014B60', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>-</button>
                  <span style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontWeight: 800, fontSize: '0.9rem', width: '20px', textAlign: 'center', color: '#014B60' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(idx, 1)} style={{ background: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#014B60', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '2rem 0 1rem 0', borderTop: cartItems.length > 0 ? '1px solid #eee' : 'none', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '1.25rem', color: '#014B60' }}>
            <span style={{ fontWeight: 400 }}>Subtotal</span>
            <span style={{ fontWeight: 900 }}>৳{subtotal.toLocaleString()}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={() => {
               onClose();
               setTimeout(onProceed, 400); // trigger checkout after cart closes visually
            }}
            style={{
              width: '100%', padding: '1.25rem', backgroundColor: cartItems.length === 0 ? '#CBD0D2' : '#FF0000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 900, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: cartItems.length === 0 ? 'none' : '0 10px 20px rgba(255,0,0,0.2)', transition: 'background 0.3s, transform 0.2s', opacity: cartItems.length === 0 ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if(cartItems.length > 0) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { if(cartItems.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
