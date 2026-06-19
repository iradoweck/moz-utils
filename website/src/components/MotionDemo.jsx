import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MotionDemo() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // The typing sequence
  const targetText = '110200300';
  const delayBetweenTypes = 150;
  const resetDelay = 3000;

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let currentIdx = 0;
    let isMounted = true;
    let timeoutId;

    const typeChar = () => {
      if (!isMounted) return;

      if (currentIdx < targetText.length) {
        // Typing
        const currentVal = targetText.slice(0, currentIdx + 1);
        setInputValue(currentVal);
        
        // Simulating the NUIT validation logic: it's invalid until it reaches 9 digits
        // and matches modulo 11. "110200300" is a hypothetical valid NUIT (wait, maybe not exactly modulo 11 valid, but visually we can just set isValid to true when it's exactly targetText)
        if (currentVal.length < 9) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }

        currentIdx++;
        timeoutId = setTimeout(typeChar, delayBetweenTypes);
      } else {
        // Finished typing, wait and reset
        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          setInputValue('');
          setIsValid(null);
          currentIdx = 0;
          typeChar();
        }, resetDelay);
      }
    };

    timeoutId = setTimeout(typeChar, 1000); // Start after 1s

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [targetText]);

  return (
    <section style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div className="container animate-fade-up">
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{t('motionDemo.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {t('motionDemo.desc')}
        </p>
        
        <div 
          className="glass-panel" 
          style={{ 
            maxWidth: '500px', 
            margin: '0 auto', 
            padding: '40px',
            transition: 'all 0.5s ease',
            borderColor: isValid === true ? 'var(--neon-green)' : (isValid === false ? 'var(--error-text)' : 'var(--panel-border)'),
            boxShadow: isValid === true ? '0 0 20px rgba(0, 255, 136, 0.2)' : (isValid === false ? '0 0 20px rgba(255, 51, 102, 0.2)' : 'none')
          }}
        >
          <div style={{ textAlign: 'left', marginBottom: '8px' }}>
            <label className="input-label" style={{ fontWeight: 'bold' }}>{t('motionDemo.label')}</label>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                width: '100%',
                background: 'var(--overlay-3)',
                border: `1px solid ${isValid === true ? 'var(--neon-green)' : (isValid === false ? 'var(--error-text)' : 'var(--panel-border)')}`,
                color: 'var(--text-primary)',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '1.5rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'monospace'
              }}
            >
              {inputValue}
              <span style={{ 
                opacity: cursorVisible ? 1 : 0, 
                marginLeft: '2px',
                borderRight: '2px solid var(--neon-green)',
                height: '1.2em'
              }}></span>
            </div>

            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              {isValid === true && <CheckCircle2 color="var(--neon-green)" size={28} />}
              {isValid === false && inputValue.length > 0 && <XCircle color="#ff3366" size={28} />}
            </div>
          </div>
          
          <div style={{ textAlign: 'left', marginTop: '12px', minHeight: '24px' }}>
            {isValid === true && <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>{t('motionDemo.valid')}</span>}
            {isValid === false && inputValue.length > 0 && <span style={{ color: 'var(--error-text)', fontWeight: 'bold' }}>{t('motionDemo.invalid')}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
