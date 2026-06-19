import React, { useEffect, useState } from 'react';
import { Users, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CommunityCTA() {
  const { t } = useTranslation();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch contributors from GitHub
    fetch('https://api.github.com/repos/iradoweck/moz-utils/contributors')
      .then(res => {
        if (!res.ok) throw new Error('API Rate Limit or Network Error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContributors(data.slice(0, 10)); // Top 10 contributors
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load contributors', err);
        // Fallback fake data if API fails
        setContributors([
          { id: 1, login: 'iradoweck', avatar_url: 'https://avatars.githubusercontent.com/u/104273523?v=4', html_url: 'https://github.com/iradoweck' },
          { id: 2, login: 'moz-dev', avatar_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4', html_url: '#' },
          { id: 3, login: 'africa-coder', avatar_url: 'https://avatars.githubusercontent.com/u/583231?s=200&v=4', html_url: '#' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ padding: '100px 0', textAlign: 'center', position: 'relative' }}>
      <div className="container">
        
        <div style={{
          background: 'var(--body-bg-gradient)',
          border: '1px solid var(--panel-border)',
          borderRadius: '24px',
          padding: '60px 40px',
          boxShadow: '0 20px 40px var(--shadow-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow inside the box */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '300px', height: '300px', background: 'var(--success-bg)',
            filter: 'blur(100px)', borderRadius: '50%', zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Users size={48} color="var(--neon-green)" style={{ margin: '0 auto 24px auto' }} />
            
            <h2 style={{ fontSize: '3rem', marginBottom: '16px', letterSpacing: '-1px' }}>
              Join the <span className="text-neon">Movement</span>
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              Seja parte do futuro do desenvolvimento moçambicano. Contribua com código, melhore a documentação ou ajude a divulgar a `moz-utils` pelo mundo.
            </p>

            {/* Contributor Avatars */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              {loading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Carregando Heróis...</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {contributors.map((c, i) => (
                    <a 
                      key={c.id} 
                      href={c.html_url} 
                      target="_blank" 
                      rel="noreferrer"
                      title={c.login}
                      style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%',
                        border: '3px solid var(--dark-bg)',
                        marginLeft: i === 0 ? '0' : '-15px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        zIndex: 10 - i,
                        display: 'block'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <img src={c.avatar_url} alt={c.login} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </a>
                  ))}
                  <div style={{
                    width: '50px', height: '50px',
                    borderRadius: '50%',
                    background: 'var(--overlay-2)',
                    border: '3px solid var(--dark-bg)',
                    marginLeft: '-15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    zIndex: 0
                  }}>
                    +
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <a href="https://github.com/iradoweck/moz-utils/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
                Tornar-se Contribuidor
              </a>
              <a href="https://github.com/iradoweck/moz-utils" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
                <Star size={20} /> Deixar uma Star
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
