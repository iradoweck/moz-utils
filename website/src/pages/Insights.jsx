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
      try {
        const [ghRepoRes, ghContribRes, npmRes, packagistRes, pubRes, pypiRes] = await Promise.allSettled([
          fetch('https://api.github.com/repos/iradoweck/moz-utils'),
          fetch('https://api.github.com/repos/iradoweck/moz-utils/contributors'),
          fetch('https://api.npmjs.org/downloads/point/last-month/moz-utils'),
          fetch('https://packagist.org/packages/iradoweck/moz-utils.json'),
          fetch('https://corsproxy.io/?' + encodeURIComponent('https://pub.dev/api/packages/moz_utils/metrics')),
          fetch('https://corsproxy.io/?' + encodeURIComponent('https://pypistats.org/api/packages/moz-utils/recent'))
        ]);

        const ghRepo = ghRepoRes.status === 'fulfilled' && ghRepoRes.value.ok ? await ghRepoRes.value.json() : null;
        const ghContrib = ghContribRes.status === 'fulfilled' && ghContribRes.value.ok ? await ghContribRes.value.json() : [];
        const npmData = npmRes.status === 'fulfilled' && npmRes.value.ok ? await npmRes.value.json() : null;
        const packagistData = packagistRes.status === 'fulfilled' && packagistRes.value.ok ? await packagistRes.value.json() : null;
        const pubData = pubRes.status === 'fulfilled' && pubRes.value.ok ? await pubRes.value.json() : null;
        const pypiData = pypiRes.status === 'fulfilled' && pypiRes.value.ok ? await pypiRes.value.json() : null;

        setStats({
          downloads: { 
            ts: npmData?.downloads ? npmData.downloads.toLocaleString() : '0', 
            php: packagistData?.package?.downloads?.total ? packagistData.package.downloads.total.toLocaleString() : '0', 
            python: pypiData?.data?.last_month ? pypiData.data.last_month.toLocaleString() : '0', 
            dart: pubData?.score?.downloadCount30Days ? pubData.score.downloadCount30Days.toLocaleString() : '0' 
          },
          github: { 
            stars: ghRepo?.stargazers_count || 0, 
            forks: ghRepo?.forks_count || 0 
          },
          contributors: Array.isArray(ghContrib) ? ghContrib.map(c => ({
            login: c.login,
            avatar: c.avatar_url,
            contributions: c.contributions
          })) : []
        });
      } catch (err) {
        console.error('Error fetching real insights data', err);
      }
    }

    fetchRealData();
  }, []);

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.insights')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Estatísticas de uso em tempo real, transferências e o nosso ranking de contribuidores.
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Star size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.github.stars}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>GitHub Stars</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <GitFork size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.github.forks}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Forks</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Download size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.ts}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Downloads NPM</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.php}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Downloads Packagist</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.python}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Downloads PyPI</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BarChart3 size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.downloads.dart}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Downloads Pub.dev</p>
        </div>
      </div>

      {/* Top Contribuidores (Formato Xadrez) */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users color="var(--neon-green)" /> Top Contribuidores
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
              <span style={{ 
                background: 'rgba(0,0,0,0.5)', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                color: 'var(--neon-green)'
              }}>
                {c.contributions} commits
              </span>
            </div>
          )) : (
            <p style={{ color: 'var(--text-secondary)' }}>A carregar contribuidores...</p>
          )}
        </div>
      </div>
    </div>
  );
}
