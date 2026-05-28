import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Star, GitFork, Download, Users } from 'lucide-react';

export default function Insights() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    downloads: { ts: '...', php: '...', python: '...', dart: '...' },
    github: { stars: '...', forks: '...' },
    contributors: []
  });

  useEffect(() => {
    async function fetchRealData() {
      const safeFetch = async (url, isJson = true) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) return null;
          return isJson ? await res.json() : await res.text();
        } catch (e) {
          return null;
        }
      };

      // GitHub Stats
      safeFetch('https://api.github.com/repos/iradoweck/moz-utils').then(data => {
        if (data) {
          setStats(s => ({ ...s, github: { stars: data.stargazers_count || 0, forks: data.forks_count || 0 } }));
        }
      });

      // Contributors
      safeFetch('https://api.github.com/repos/iradoweck/moz-utils/contributors').then(data => {
        if (data && Array.isArray(data)) {
          setStats(s => ({ ...s, contributors: data.map(c => ({ login: c.login, avatar: c.avatar_url, contributions: c.contributions })) }));
        }
      });

      // Typescript (NPM)
      safeFetch('https://api.npmjs.org/downloads/point/last-month/moz-utils').then(data => {
        if (data?.downloads) {
          setStats(s => ({ ...s, downloads: { ...s.downloads, ts: data.downloads.toLocaleString() } }));
        }
      });

      // PHP (Packagist)
      safeFetch('https://packagist.org/packages/iradoweck/moz-utils.json').then(data => {
        if (data?.package?.downloads?.total) {
          setStats(s => ({ ...s, downloads: { ...s.downloads, php: data.package.downloads.total.toLocaleString() } }));
        }
      });

      // Dart (Pub.dev) via proxy
      safeFetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://pub.dev/api/packages/moz_utils/metrics')).then(data => {
        if (data?.score?.downloadCount30Days) {
          setStats(s => ({ ...s, downloads: { ...s.downloads, dart: data.score.downloadCount30Days.toLocaleString() } }));
        }
      });

      // Python (PyPI) via proxy
      safeFetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://pypistats.org/api/packages/moz-utils/recent')).then(data => {
        if (data?.data?.last_month) {
          setStats(s => ({ ...s, downloads: { ...s.downloads, python: data.data.last_month.toLocaleString() } }));
        }
      });
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

      {/* Estatísticas Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {(stats.github.stars === '...' || stats.github.stars >= 3) && (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <Star size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.github.stars}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t('insights_page.github_stars')}</p>
          </div>
        )}
        {(stats.github.forks === '...' || stats.github.forks >= 3) && (
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

      {/* Top Contribuidores (Formato Xadrez) */}
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
