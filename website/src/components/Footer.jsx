import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Coffee } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(9, 10, 15, 0.95)',
      padding: '16px 24px',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Lado Esquerdo: Patrocínio, Suporte e Créditos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>{t('footer.sponsoredBy', 'Patrocinado e suportado por')}</span>
          
          <a 
            href="https://opensource.zedecks.com" 
            target="_blank" 
            rel="noreferrer"
            title="Zedeck's IT Open Source"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              textDecoration: 'none' 
            }}
          >
            <img 
              src="/moz-utils/zedecks-it-logo.png" 
              alt="Zedeck's IT" 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                border: '1.5px solid var(--border-subtle)',
                objectFit: 'cover',
                verticalAlign: 'middle',
                transition: 'transform 0.2s ease'
              }}
              onError={(e) => {
                e.target.src = '/zedecks-it-logo.png';
              }}
            />
          </a>

          <span>{t('footer.andDevelopedBy', 'e Desenvolvido por')}</span>

          <a 
            href="https://github.com/iradoweck" 
            target="_blank" 
            rel="noreferrer"
            title="Edmilson Muacigaro (@iradoweck)"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}
          >
            <img 
              src="https://github.com/iradoweck.png?size=64" 
              alt="Edmilson Muacigaro" 
              style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: '1.5px solid var(--moz-green-border)',
                verticalAlign: 'middle'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span>Edmilson Muacigaro</span>
          </a>

          <span>& {t('footer.community', 'Comunidade')}</span>
        </div>

        {/* Lado Direito: Licença + Apoio / Doações em Círculos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://github.com/iradoweck/moz-utils/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            title="Licença Apache 2.0"
            style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              textDecoration: 'none'
            }}
          >
            Apache-2.0
          </a>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            {t('footer.supportProject', 'Apoiar o projeto:')}
          </span>

          {/* GitHub Sponsor */}
          <a 
            href="https://github.com/sponsors/iradoweck" 
            target="_blank" 
            rel="noreferrer"
            title="Apoiar no GitHub Sponsors"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#fdf2f8',
              border: '1px solid #fbcfe8',
              color: '#db2777',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              textDecoration: 'none'
            }}
          >
            <Heart size={16} fill="currentColor" />
          </a>

          {/* Ko-fi */}
          <a 
            href="https://ko-fi.com/edmilsonmuacigarro" 
            target="_blank" 
            rel="noreferrer"
            title="Comprar um café no Ko-fi"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              textDecoration: 'none'
            }}
          >
            <Coffee size={16} />
          </a>

          {/* PayPal */}
          <a 
            href="https://paypal.me/iradoweck" 
            target="_blank" 
            rel="noreferrer"
            title="Doar via PayPal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              textDecoration: 'none'
            }}
          >
            P
          </a>
        </div>

      </div>
    </footer>
  );
}
