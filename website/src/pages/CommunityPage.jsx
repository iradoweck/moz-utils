import React from 'react';
import { MessageSquare, Users, AlertCircle, Briefcase } from 'lucide-react';
import Giscus from '@giscus/react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';

export default function CommunityPage() {
  const { t } = useTranslation();
  useSEO(
    'Community',
    'Join the moz-utils community. Report bugs, share ideas, discuss architecture, and become a maintainer of the open-source Mozambique utility library.'
  );

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{t('nav.community')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Join the discussions, report bugs, and help shape the future of the library.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <a href="https://github.com/iradoweck/moz-utils/discussions" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <MessageSquare size={32} color="var(--neon-green)" style={{ marginBottom: '16px' }} />
          <h3>Discussions and Debates</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Have an idea for a new function? Want to discuss the architecture? Join the GitHub Discussions.
          </p>
        </a>

        <a href="https://github.com/iradoweck/moz-utils/issues" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          <AlertCircle size={32} color="#ff3366" style={{ marginBottom: '16px' }} />
          <h3>Report Bugs (Issues)</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Found a bug in a DIRE or phone number validation? Open an Issue so we can fix it quickly.
          </p>
        </a>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Users size={48} color="var(--neon-green)" />
          <div style={{ flex: 1 }}>
            <h3>Want to become a Maintainer?</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              We are always looking for Mozambican talent to help maintain the TypeScript, PHP, Python, Dart, and Kotlin libraries. Contribute actively and join the Core Team!
            </p>
          </div>
        </div>

        <a href="https://edmilsonmuacigarro.com" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', textDecoration: 'none', color: 'inherit' }}>
          <Briefcase size={48} color="#00b4d8" />
          <div style={{ flex: 1 }}>
            <h3>Business & Partnerships</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Are you from a company or startup and want to implement moz-utils? Let's talk business. Reach out to the author.
            </p>
          </div>
        </a>
      </div>

      <div style={{ marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '2rem' }}>Live Community Forum</h2>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <Giscus
            id="community-forum"
            repo="iradoweck/moz-utils"
            repoId="R_kgDOSjDxow"
            category="General"
            categoryId="DIC_kwDOSjDxo84C9pTy"
            mapping="pathname"
            term="Welcome to the moz-utils Community!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="transparent_dark"
            lang="en"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
