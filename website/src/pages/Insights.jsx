import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Star, GitFork, Download, Users } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Insights() {
  const { t } = useTranslation();
  useSEO(
    'Insights',
    'Live download stats, GitHub activity, and contributor metrics for moz-utils across NPM, PyPI, Packagist, and pub.dev.'
  );

  const [stats, setStats] = useState({
    downloads: { ts: '...', php: '...', python: '...', dart: '...' },
    github: { stars: '...', forks: '...' },
    contributors: []
  });

  useEffect(() => {
    async function fetchRealData() {
      try {
        const res = await fetch('/stats.json');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats.json', err);
      }
    }

    fetchRealData();
  }, []);

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.insights')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {t('insights_page.description')}
        </p>
      </div>

      {/* General Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {(stats.github.stars === '...' || Number(stats.github.stars) >= 3) && (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <Star size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.github.stars}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.github_stars')}</p>
          </div>
        )}
        {(stats.github.forks === '...' || Number(stats.github.forks) >= 3) && (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <GitFork size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.github.forks}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.forks')}</p>
          </div>
        )}
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Download size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.ts}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.downloads_npm')}</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.php}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.downloads_packagist')}</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.python}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.downloads_pypi')}</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.dart}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.downloads_pub')}</p>
        </div>
      </div>

      {/* Top Contributors (Chessboard Layout) */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users color="var(--neon-green)" /> {t('insights_page.top_contributors')}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px' 
        }}>
          {stats.contributors.length > 0 ? stats.contributors.map((c, idx) => (
            <div key={idx} className="glass-panel" style={{ 
              textAlign: 'center', 
              padding: '24px 12px',
              backgroundColor: idx % 2 === 0 ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'
            }}>
              <img 
                src={c.avatar} 
                alt={c.login} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '12px', border: '2px solid var(--neon-green)' }} 
              />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', wordBreak: 'break-all' }}>@{c.login}</h4>
              {['iradoweck', 'zedeckmuacy'].includes(c.login.toLowerCase()) ? (
                <span style={{ 
                  background: 'rgba(255,215,0,0.2)', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  color: '#FFD700',
                  fontWeight: 'bold'
                }}>
                  {t('insights_page.creator_maintainer')}
                </span>
              ) : (
                <span style={{ 
                  background: 'rgba(0,0,0,0.5)', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  color: 'var(--neon-green)'
                }}>
                  {c.contributions} {t('insights_page.commits')}
                </span>
              )}
            </div>
          )) : (
            <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.loading_contributors')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
