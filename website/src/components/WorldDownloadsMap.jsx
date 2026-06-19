import React, { useEffect, useState } from 'react';

// Random simulated global coordinates representing downloads
const generateRandomDownloads = () => {
  const points = [];
  for (let i = 0; i < 40; i++) {
    points.push({
      id: i,
      // Random map distribution (heavily favoring Africa/Europe/Americas conceptually)
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      opacity: Math.random() * 0.5 + 0.3,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5
    });
  }
  return points;
};

export default function WorldDownloadsMap() {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    setDownloads(generateRandomDownloads());
    
    const interval = setInterval(() => {
      setDownloads(generateRandomDownloads());
    }, 8000); // Change distribution every 8s

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '300px',
      background: 'var(--panel-bg)',
      borderRadius: '16px',
      border: '1px solid var(--panel-border)',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '40px',
      boxShadow: '0 10px 30px var(--shadow-color)'
    }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Live Global Downloads</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', display: 'inline-block' }} className="animate-ping" />
          Real-time map simulation
        </p>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: 0.8 }}>
        {/* Abstract simple world map shapes (very simplified continents) */}
        <path d="M 20 30 Q 30 25 40 30 T 60 20 T 80 40 T 70 70 T 50 80 T 20 60 Z" fill="none" stroke="var(--text-secondary)" strokeWidth="0.2" opacity="0.2" strokeDasharray="1,1" />
        <path d="M 45 40 Q 55 45 50 60 T 40 70 T 35 50 Z" fill="none" stroke="var(--text-secondary)" strokeWidth="0.2" opacity="0.2" />

        {/* Origin Node (Nampula) */}
        <circle cx="53" cy="62" r="1.5" fill="var(--neon-green)" />
        <circle cx="53" cy="62" r="3" fill="none" stroke="var(--neon-green)" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: '2s' }} />

        {/* Download blips */}
        {downloads.map(pt => (
          <g key={pt.id} style={{ animation: `fadeUp 1s ease-in-out ${pt.delay}s forwards`, opacity: 0 }}>
            <circle cx={pt.x} cy={pt.y} r={pt.size} fill="var(--success-bg)" />
            <circle cx={pt.x} cy={pt.y} r={pt.size / 2} fill="var(--neon-green)" />
            <line x1="53" y1="62" x2={pt.x} y2={pt.y} stroke="var(--neon-green)" strokeWidth="0.1" opacity="0.3" />
          </g>
        ))}
      </svg>

      {/* Fade overlay for depth */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, var(--panel-bg))' }} />
    </div>
  );
}
