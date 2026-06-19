import React, { useEffect, useState } from 'react';

// Simplified SVG paths for demonstration (A stylized map representing Africa/Mozambique)
// We will use a dot matrix approach or SVG circles for a "tech" feel.
const mapNodes = [
  // Nampula (Origin)
  { id: 'nampula', cx: 65, cy: 70, isOrigin: true, name: 'Nampula, MZ' },
  // Other Global Nodes
  { id: 'node1', cx: 30, cy: 30, name: 'London' },
  { id: 'node2', cx: 20, cy: 45, name: 'New York' },
  { id: 'node3', cx: 45, cy: 20, name: 'Berlin' },
  { id: 'node4', cx: 80, cy: 40, name: 'Tokyo' },
  { id: 'node5', cx: 55, cy: 85, name: 'Cape Town' },
  { id: 'node6', cx: 15, cy: 75, name: 'São Paulo' },
  { id: 'node7', cx: 90, cy: 70, name: 'Sydney' }
];

export default function WorldMapNodes() {
  const [activeLines, setActiveLines] = useState([]);

  useEffect(() => {
    // Randomly animate lines from Nampula to other nodes
    const interval = setInterval(() => {
      const targets = mapNodes.filter(n => !n.isOrigin);
      const randomTarget = targets[Math.floor(Math.random() * targets.length)];
      
      const newLine = { id: Date.now(), targetId: randomTarget.id };
      setActiveLines(prev => [...prev.slice(-4), newLine]); // keep max 5 lines
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      opacity: 0.6
    }}>
      {/* Background glow behind the map */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vw',
        background: 'var(--neon-green-glow)',
        filter: 'blur(150px)',
        borderRadius: '50%',
        opacity: 0.3
      }} />

      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--neon-green)" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Draw subtle connections background */}
        {mapNodes.filter(n => !n.isOrigin).map(target => (
          <line
            key={`bg-${target.id}`}
            x1="65" y1="70"
            x2={target.cx} y2={target.cy}
            stroke="var(--text-secondary)"
            strokeWidth="0.1"
            strokeOpacity="0.2"
          />
        ))}

        {/* Draw active animated lines */}
        {activeLines.map(line => {
          const target = mapNodes.find(n => n.id === line.targetId);
          if (!target) return null;
          return (
            <g key={line.id}>
              <line
                x1="65" y1="70"
                x2={target.cx} y2={target.cy}
                stroke="url(#lineGradient)"
                strokeWidth="0.4"
                className="animate-pulse-line"
              />
              <circle 
                cx={target.cx} cy={target.cy} 
                r="1" 
                fill="var(--neon-green)"
                filter="url(#glow)"
                className="animate-ping"
              />
            </g>
          );
        })}

        {/* Draw all nodes */}
        {mapNodes.map(node => (
          <g key={node.id}>
            <circle 
              cx={node.cx} cy={node.cy} 
              r={node.isOrigin ? 1.5 : 0.6} 
              fill={node.isOrigin ? 'var(--neon-green)' : 'var(--text-secondary)'}
              filter={node.isOrigin ? 'url(#glow)' : ''}
            />
            {node.isOrigin && (
              <circle 
                cx={node.cx} cy={node.cy} 
                r="3" 
                fill="none"
                stroke="var(--neon-green)"
                strokeWidth="0.2"
                className="animate-ping"
                style={{ animationDuration: '3s' }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
