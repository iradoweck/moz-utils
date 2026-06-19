import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Giscus from '@giscus/react';
import { MessageSquare, Briefcase, Mail, HelpCircle, Lightbulb, Rocket, Megaphone } from 'lucide-react';

export default function CommunityPage() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('General');
  const forumRef = useRef(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      forumRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <MessageSquare size={48} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-1px' }}>
          {t('community_page.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          {t('community_page.description')}
        </p>
      </div>

      {/* Topics Grid */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>
          {t('community_page.topics_title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          <div 
            onClick={() => handleCategoryClick('Q&A')}
            className="glass-panel" 
            style={{ padding: '24px', textAlign: 'center', cursor: 'pointer', border: activeCategory === 'Q&A' ? '2px solid #00b4d8' : undefined, transition: 'all 0.2s' }}
          >
            <HelpCircle size={32} color="#00b4d8" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('community_page.topics.qa.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{t('community_page.topics.qa.desc')}</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Ideas')}
            className="glass-panel" 
            style={{ padding: '24px', textAlign: 'center', cursor: 'pointer', border: activeCategory === 'Ideas' ? '2px solid #ff9f0a' : undefined, transition: 'all 0.2s' }}
          >
            <Lightbulb size={32} color="#ff9f0a" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('community_page.topics.ideas.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{t('community_page.topics.ideas.desc')}</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Show and tell')}
            className="glass-panel" 
            style={{ padding: '24px', textAlign: 'center', cursor: 'pointer', border: activeCategory === 'Show and tell' ? '2px solid #bf5af2' : undefined, transition: 'all 0.2s' }}
          >
            <Rocket size={32} color="#bf5af2" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('community_page.topics.showcase.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{t('community_page.topics.showcase.desc')}</p>
          </div>

          <div 
            onClick={() => handleCategoryClick('Announcements')}
            className="glass-panel" 
            style={{ padding: '24px', textAlign: 'center', cursor: 'pointer', border: activeCategory === 'Announcements' ? '2px solid var(--neon-green)' : undefined, transition: 'all 0.2s' }}
          >
            <Megaphone size={32} color="var(--neon-green)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('community_page.topics.announcements.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{t('community_page.topics.announcements.desc')}</p>
          </div>

        </div>
      </div>

      {/* B2B / Business Contact Section */}
      <div className="glass-panel" style={{ 
        marginBottom: '60px', 
        borderLeft: '4px solid var(--neon-green)',
        background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.05) 0%, rgba(10, 10, 10, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div style={{ padding: '12px', background: 'var(--success-bg)', borderRadius: '12px' }}>
            <Briefcase size={28} color="var(--neon-green)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
              {t('community_page.b2b_title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              {t('community_page.b2b_description')}
            </p>
            <a 
              href="mailto:hello@edmilsonmuacigarro.com" 
              className="btn-primary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <Mail size={18} />
              {t('community_page.b2b_cta')}
            </a>
          </div>
        </div>
      </div>

      {/* Giscus Forum Section */}
      <div ref={forumRef} className="glass-panel" style={{ padding: '40px 20px', scrollMarginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>
            {activeCategory === 'General' ? t('community_page.general_discussion') : `${t('community_page.topic')}: ${activeCategory}`}
          </h2>
          {activeCategory !== 'General' && (
            <button 
              onClick={() => setActiveCategory('General')}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              {t('community_page.back_to_general')}
            </button>
          )}
        </div>
        
        <Giscus
          id="comments"
          repo="iradoweck/moz-utils"
          repoId="R_kgDOSjDxow"
          category={activeCategory}
          mapping="specific"
          term={`Community Debate: ${activeCategory}`}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="dark"
          lang={i18n.language}
          loading="lazy"
        />
      </div>

    </div>
  );
}
