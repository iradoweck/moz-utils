import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, CreditCard, Github, ShieldCheck, X } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  return (
    <>
      <footer style={{ 
        padding: '40px 20px', 
        borderTop: '1px solid var(--panel-border)',
        marginTop: '60px',
        backgroundColor: 'var(--panel-bg)',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        fontSize: '0.9rem'
      }}>
        
        {/* Section 1: Logo and Stack Version */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.svg" alt="moz-utils logo" style={{ width: '28px', height: '28px' }} />
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            moz-<span className="text-neon">utils</span>
          </span>
          <span style={{ 
            background: 'rgba(0, 255, 170, 0.1)', 
            color: 'var(--neon-green)', 
            padding: '2px 8px', 
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid rgba(0, 255, 170, 0.2)'
          }}>
            v0.3.9
          </span>
        </div>

        {/* Section 2: Copyright */}
        <div style={{ fontSize: '0.95rem' }}>
          &copy; Copyright Moz-Utils By ZEDECK's IT
        </div>

        {/* Section 3: Open Source Row + Donate */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
              Open Source
            </span>
            <span title="Moçambique" style={{ fontSize: '1.3rem' }}>🇲🇿</span>
            <img 
              src="/moz-utils/zedecks-it-logo.png" 
              alt="Zedeck's IT" 
              style={{ height: '18px', objectFit: 'contain' }} 
              onError={(e) => { e.target.src = '/zedecks-it-logo.png'; }} 
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="GitHub">
              <Github size={18} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-green)', background: 'rgba(0, 255, 170, 0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 170, 0.1)' }} title="Apache 2.0 License">
              <ShieldCheck size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Apache 2.0</span>
            </div>
            <img 
              src="https://github.com/iradoweck.png" 
              alt="Edmilson Muacigarro" 
              title="Edmilson Muacigarro" 
              style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--panel-border)' }} 
            />
          </div>

          <button 
            onClick={() => setIsDonateOpen(true)}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 32px', fontSize: '0.95rem', fontWeight: 'bold', marginTop: '8px' }}
          >
            <Heart size={18} fill="currentColor" /> {t('nav.donate', 'Doar')}
          </button>
        </div>

      </footer>

      {/* Donate Modal Popup */}
      {isDonateOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--nav-bg)',
            border: '1px solid var(--panel-border)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setIsDonateOpen(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={24} />
            </button>
            
            <Heart size={48} fill="var(--neon-green)" color="var(--neon-green)" style={{ marginBottom: '24px' }} />
            
            <h2 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>
              Apoiar o Projeto
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
              O <b>moz-utils</b> é 100% open-source e mantido pela comunidade. A sua doação ajuda a manter os servidores ativos e financia a criação de novas ferramentas B2B.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="https://github.com/sponsors/iradoweck" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', padding: '14px' }}>
                <Github size={20} /> {t('footer.donatePrimary', 'Patrocinar no GitHub')}
              </a>
              <a href="https://paypal.me/iradoweck" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '1px solid var(--text-secondary)', textDecoration: 'none', padding: '14px' }}>
                <CreditCard size={20} /> {t('footer.donateSecondary', 'Doar via PayPal')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
