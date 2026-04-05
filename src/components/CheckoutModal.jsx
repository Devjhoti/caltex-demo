import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function CheckoutModal({ isOpen, onClose, cartItems }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('details'); // 'details' or 'payment'

  useEffect(() => {
    if (isOpen) {
      if (window.lenis) window.lenis.stop();
      setPhase('details');
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', display: 'flex' });
      gsap.fromTo(containerRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
      );
    } else {
      if (window.lenis) window.lenis.start();
      gsap.to(containerRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
      }});
    }
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleProceed = (e) => {
    e.preventDefault();
    setPhase('payment');
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: "'ITC Franklin Gothic LT', sans-serif",
    boxSizing: 'border-box',
    background: '#fff',
    color: '#014B60',
    marginBottom: '1rem'
  };

  const paymentBtnStyle = {
    width: '100%',
    padding: '1.25rem',
    background: '#fff',
    border: '2px solid #eee',
    borderRadius: '12px',
    fontWeight: 900,
    fontSize: '1.1rem',
    color: '#014B60',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    transition: 'all 0.2s',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: "'ITC Franklin Gothic LT', sans-serif"
  };

  return (
    <div 
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(1, 75, 96, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            fontSize: '1.5rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#014B60',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
        >
          &times;
        </button>

        <h2 style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#014B60', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>
          {phase === 'details' ? 'Delivery Details' : 'Payment Method'}
        </h2>
        <p style={{ fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '0.9rem', color: '#666', marginBottom: '2rem', lineHeight: 1.5 }}>
          {phase === 'details' ? 'Please enter your shipping information below to proceed with your order.' : 'Select a secure payment provider to complete your transaction.'}
        </p>

        {/* Order Summary Miniature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(1, 75, 96, 0.05)', borderRadius: '12px', border: '1px solid rgba(1, 75, 96, 0.1)', marginBottom: '2rem' }}>
          <span style={{ fontWeight: 800, color: '#014B60', textTransform: 'uppercase', fontFamily: "'ITC Franklin Gothic LT', sans-serif" }}>Total to Pay</span>
          <span style={{ fontWeight: 900, color: '#FF0000', fontSize: '1.1rem', fontFamily: "'ITC Franklin Gothic LT', sans-serif" }}>৳{subtotal.toLocaleString()}</span>
        </div>

        {phase === 'details' ? (
          <form onSubmit={handleProceed} style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="text" placeholder="Full Name" required style={inputStyle} />
            <input type="tel" placeholder="Phone Number (e.g. 017...)" required style={inputStyle} />
            <textarea placeholder="Delivery Address" required rows="3" style={{ ...inputStyle, resize: 'none' }} />
            
            <button 
              type="submit"
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '1.25rem',
                backgroundColor: '#014B60',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '0 10px 20px rgba(1, 75, 96, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontFamily: "'ITC Franklin Gothic LT', sans-serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Continue to Payment
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              style={paymentBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.border = '2px solid #e2136e'; e.currentTarget.style.background = '#fcf0f5' }}
              onMouseLeave={(e) => { e.currentTarget.style.border = '2px solid #eee'; e.currentTarget.style.background = '#fff' }}
              onClick={() => alert('Redirecting to bKash gateway...')}
            >
              <div style={{ width: '40px', height: '40px', background: '#e2136e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2H7v-2h2V9h2v7zm4 0h-2v-4h2v4z"/></svg>
              </div>
              Pay with bKash
            </button>
            
            <button 
              style={paymentBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.border = '2px solid #F35E19'; e.currentTarget.style.background = '#fcf2ee' }}
              onMouseLeave={(e) => { e.currentTarget.style.border = '2px solid #eee'; e.currentTarget.style.background = '#fff' }}
              onClick={() => alert('Redirecting to Nagad gateway...')}
            >
              <div style={{ width: '40px', height: '40px', background: '#F35E19', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
              </div>
              Pay with Nagad
            </button>

            <button 
              style={paymentBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.border = '2px solid #005A9C'; e.currentTarget.style.background = '#f0f5fa' }}
              onMouseLeave={(e) => { e.currentTarget.style.border = '2px solid #eee'; e.currentTarget.style.background = '#fff' }}
              onClick={() => alert('Redirecting to Visa/Mastercard gateway...')}
            >
              <div style={{ width: '40px', height: '40px', background: '#005A9C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>
              Credit / Debit Card
            </button>
            
            <button 
              onClick={() => setPhase('details')}
              style={{ background: 'none', border: 'none', color: '#666', marginTop: '1rem', textDecoration: 'underline', cursor: 'pointer', fontFamily: "'ITC Franklin Gothic LT', sans-serif" }}
            >
              ← Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
