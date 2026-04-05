import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function CheckoutModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [paymentTab, setPaymentTab] = useState('mobile'); // mobile | card
  const [mobileMethod, setMobileMethod] = useState(''); // bkash, nagad, rocket
  const [cardNumber, setCardNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      gsap.fromTo('.checkout-overlay', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo('.checkout-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power3.out' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to('.checkout-overlay', { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  const handlePlaceOrder = () => {
    setIsSuccess(true);
    // Animate checkmark
    setTimeout(() => {
      gsap.fromTo('.success-check', 
        { strokeDashoffset: 100 }, 
        { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }
      );
    }, 100);
  };

  const formatCardNumber = (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (cardNumber.startsWith('5')) return 'MASTER';
    return '';
  };

  const renderProgress = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '200px', margin: '0 auto 2rem auto', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#E0E0E0', zIndex: 0 }} />
      {[1, 2, 3].map(s => {
        let bg = s === step ? 'var(--red)' : s < step ? 'var(--teal)' : '#E0E0E0';
        return (
          <div key={s} style={{ width: '12px', height: '12px', borderRadius: '50%', background: bg, zIndex: 1, transition: 'background 0.3s' }} />
        );
      })}
    </div>
  );

  return (
    <div className="checkout-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      fontFamily: "'ITC Franklin Gothic LT', sans-serif"
    }}>
      <div className="checkout-card" style={{
        background: '#FFFFFF', maxWidth: '560px', width: '90%', borderRadius: '4px', padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#333' }}>×</button>

        {!isSuccess ? (
          <>
            {renderProgress()}
            
            {step === 1 && (
              <div>
                <h3 style={{ color: 'var(--teal)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Your Details</h3>
                <FloatingInput label="Full Name" />
                <FloatingInput label="Email Address" type="email" />
                <FloatingInput label="Phone Number" type="tel" />
                <button onClick={() => setStep(2)} style={btnStyle('var(--teal)')}>Next Step</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ color: 'var(--teal)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Delivery Address</h3>
                <FloatingInput label="Street Address" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <FloatingInput label="City" />
                  <FloatingInput label="District" />
                </div>
                <FloatingInput label="Postal Code" />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => setStep(1)} style={btnOutlineStyle}>Back</button>
                  <button onClick={() => setStep(3)} style={btnStyle('var(--teal)')}>Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ color: 'var(--teal)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Payment</h3>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #EEE' }}>
                  <div onClick={() => setPaymentTab('mobile')} style={tabStyle(paymentTab === 'mobile')}>Mobile Banking</div>
                  <div onClick={() => setPaymentTab('card')} style={tabStyle(paymentTab === 'card')}>Card Payment</div>
                </div>

                {paymentTab === 'mobile' && (
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      {['bKash', 'Nagad', 'Rocket'].map(m => (
                        <div key={m} onClick={() => setMobileMethod(m)} style={mobileCardStyle(mobileMethod === m)}>
                          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{m}</span>
                        </div>
                      ))}
                    </div>
                    {mobileMethod && <FloatingInput label={`Enter your ${mobileMethod} account number`} />}
                  </div>
                )}

                {paymentTab === 'card' && (
                  <div>
                    <div style={{ position: 'relative' }}>
                      <FloatingInput label="Card Number" value={cardNumber} onChange={formatCardNumber} />
                      <span style={{ position: 'absolute', right: 0, top: '10px', fontWeight: 900, color: '#999' }}>{getCardType()}</span>
                    </div>
                    <FloatingInput label="Cardholder Name" />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <FloatingInput label="Expiry Date (MM/YY)" />
                      <FloatingInput label="CVV" type="password" />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button onClick={() => setStep(2)} style={{...btnOutlineStyle, flex: 0.3}}>Back</button>
                  <button onClick={handlePlaceOrder} style={{...btnStyle('var(--red)'), flex: 1, letterSpacing: '0.15em', fontWeight: 900, fontSize: '1.1rem'}}>PLACE ORDER</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <svg width="80" height="80" viewBox="0 0 100 100" style={{ margin: '0 auto 1.5rem auto' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--teal)" strokeWidth="4" />
              <path className="success-check" d="M30 50 L45 65 L70 35" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="100" strokeDashoffset="100" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--teal)', margin: '0 0 1rem 0' }}>Order Placed!</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem' }}>Thank you for choosing Caltex Bangladesh.</p>
            <button onClick={handleClose} style={btnStyle('var(--teal)')}>Return to Site</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents & Styles

function FloatingInput({ label, type = 'text', value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState('');
  
  const active = focused || val || (value !== undefined && value !== '');

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem', width: '100%' }}>
      <label style={{
        position: 'absolute',
        top: active ? '-5px' : '15px',
        left: '0',
        fontSize: active ? '0.8rem' : '1rem',
        color: active ? 'var(--teal)' : '#999',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
        fontWeight: active ? 900 : 400
      }}>{label}</label>
      <input 
        type={type}
        value={value !== undefined ? value : val}
        onChange={(e) => {
          if(onChange) onChange(e);
          else setVal(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '12px 0 5px 0',
          border: 'none',
          borderBottom: `2px solid ${focused ? 'var(--teal)' : '#CCC'}`,
          background: 'transparent',
          outline: 'none',
          fontSize: '1.1rem',
          color: '#333',
          fontFamily: 'inherit'
        }}
      />
    </div>
  );
}

const btnStyle = (bg) => ({
  width: '100%', padding: '14px', background: bg, color: '#FFF', border: 'none', borderRadius: '4px',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 900, textTransform: 'uppercase', transition: 'opacity 0.2s'
});

const btnOutlineStyle = {
  flex: 1, padding: '14px', background: 'transparent', border: '2px solid #CCC', color: '#666', borderRadius: '4px',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 900, textTransform: 'uppercase'
};

const tabStyle = (active) => ({
  paddingBottom: '0.8rem', cursor: 'pointer', fontWeight: 900, color: active ? 'var(--red)' : '#999',
  borderBottom: active ? '2px solid var(--red)' : '2px solid transparent', transition: 'all 0.2s', marginBottom: '-1px'
});

const mobileCardStyle = (active) => ({
  flex: 1, border: active ? '2px solid var(--teal)' : '2px solid #EEE', borderRadius: '4px', padding: '1rem',
  textAlign: 'center', cursor: 'pointer', background: active ? '#F0F5F7' : '#FFF', transition: 'all 0.2s',
  color: active ? 'var(--teal)' : '#999'
});
