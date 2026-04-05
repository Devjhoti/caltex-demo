import React, { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are Caltex Agent, an expert assistant for Caltex Bangladesh, distributed exclusively by ASTRO Engineering Ltd in Bangladesh.

KNOWLEDGE BASE:

COMPANY:
- Caltex is a global energy brand with 80+ years of expertise
- In Bangladesh, Caltex products are distributed by ASTRO Engineering Ltd
- ASTRO Engineering Ltd is the authorized local distributor
- Tagline: Enjoy the journey

PRODUCTS:
1. Caltex Techron — Fuel additive. Cleans fuel injectors, removes deposits, restores engine performance.
2. Havoline Pro DS — Premium fully synthetic engine oil. Maximum protection for modern engines.
3. Havoline Super 4T — Mineral engine oil for 4-stroke motorcycle engines. Reliable everyday protection.
4. Havoline Super 4T Semi Synthetic — Semi synthetic blend for 4-stroke engines. Balance of performance and value.
5. Havoline Coolant Premix — Premixed engine coolant. Prevents overheating and corrosion year-round.

RECOMMENDATIONS:
- For high performance motorcycles: Havoline Super 4T Semi Synthetic
- For daily commuter bikes: Havoline Super 4T
- For modern car engines: Havoline Pro DS
- For fuel system cleaning: Caltex Techron
- For cooling system: Havoline Coolant Premix

LOCATION:
- Caltex stations available across Bangladesh
- Contact ASTRO Engineering Ltd for dealership and bulk orders

RULES:
- Only answer questions related to Caltex products, engine oils, vehicle maintenance, and ASTRO Engineering Ltd
- If asked anything unrelated, politely redirect to Caltex topics
- Always be helpful, professional and concise
- Recommend the right product based on user's vehicle type`;

export default function CaltexAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I'm Caltex Agent 👋\nI can help you with product recommendations, engine oil selection, and anything about Caltex Bangladesh. How can I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {

      const isLocal = import.meta.env.DEV;
      const apiSettings = {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage.content }
          ],
          max_tokens: 1024,
          temperature: 0.7
      };

      const response = await fetch(isLocal ? 'https://api.groq.com/openai/v1/chat/completions' : '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isLocal ? { 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` } : {})
        },
        body: JSON.stringify(apiSettings)
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Invalid API Response');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to my systems right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes agentPulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
          }
          .caltex-agent-btn {
            animation: agentPulse 2s infinite;
          }
          @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #014B60;
            border-radius: 50%;
            display: inline-block;
            animation: typingBounce 1.4s infinite ease-in-out both;
          }
      `}} />

      {/* Trigger Button */}
      <button
        className="caltex-agent-btn"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          backgroundColor: '#014B60',
          borderRadius: '50%',
          border: '2px solid #FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 99999,
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.8)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg fill="#FFF" width="28px" height="28px" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" /></svg>
      </button>

      {/* Chat Window */}
      <div
        style={{
          position: 'fixed',
          bottom: '104px',
          right: '32px',
          width: '360px',
          height: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 99999,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transformOrigin: 'bottom right',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: '#014B60', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #FF0000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logos/Caltex-Woodmark(Circular).png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#FFF', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Caltex Agent
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#4CD964', borderRadius: '50%' }}></div>
                <span style={{ color: '#CBD0D2', fontFamily: "'ITC Franklin Gothic LT', sans-serif", fontSize: '11px', fontWeight: 400 }}>
                  Always here to help
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Messages Area */}
        <div 
          data-lenis-prevent="true"
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          style={{ flex: 1, backgroundColor: '#F5F5F5', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', overscrollBehavior: 'contain' }}
        >
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: isUser ? '#014B60' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#014B60',
                    padding: '12px 16px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    border: isUser ? 'none' : '1px solid #CBD0D2',
                    maxWidth: '85%',
                    fontFamily: "'ITC Franklin Gothic LT', sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ color: '#979A9C', fontSize: '10px', marginTop: '4px', fontFamily: "'ITC Franklin Gothic LT', sans-serif", padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid #CBD0D2',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}
              >
                <div className="typing-dot" style={{ animationDelay: '-0.32s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '-0.16s' }}></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #CBD0D2', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about our products..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: "'ITC Franklin Gothic LT', sans-serif",
              fontSize: '14px',
              backgroundColor: 'transparent',
              color: '#014B60'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: inputText.trim() ? '#FF0000' : '#E0E0E0',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </>
  );
}
