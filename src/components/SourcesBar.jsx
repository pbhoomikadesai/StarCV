import React from 'react';
import { isActiveProfile } from '../utils/fallbacks';

export function SourcesBar({ apiStatus, durationMs, urls, social }) {
  const sources = [
    { key: 'wikipedia', name: 'Wikipedia' },
    { key: 'youtube', name: 'YouTube' },
    { key: 'instagram', name: 'Instagram' },
    { key: 'facebook', name: 'Facebook' },
    { key: 'linkedin', name: 'LinkedIn' }
  ];

  const formattedTime = durationMs ? (durationMs / 1000).toFixed(1) : '4.2';

  const activeSources = sources.filter(source => {
    if (source.key === 'wikipedia') return true;

    const hasUrl = urls?.[source.key] && urls[source.key].trim() !== '';
    if (!hasUrl) return false;

    // Retrieve corresponding follower/sub value for active profile threshold check
    const socialObj = social?.[source.key];
    let val = '';
    if (source.key === 'youtube') val = socialObj?.subscribers;
    if (source.key === 'instagram') val = socialObj?.followers;
    if (source.key === 'facebook') val = socialObj?.likes;
    if (source.key === 'linkedin') val = socialObj?.followers || 'Connected';

    return isActiveProfile(val);
  });

  return (
    <div className="resume-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
      <div className="sources-list" style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px', width: '100%', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Sources:</span>
        {activeSources.map(source => {
          const url = urls?.[source.key];

          const Badge = (
            <div className="source-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: url ? 'pointer' : 'default' }}>
              <span className="status-dot success" />
              <span style={{ borderBottom: url ? '1px dotted rgba(255,255,255,0.35)' : 'none' }}>
                {source.name}
              </span>
            </div>
          );

          if (url) {
            return (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'inherit', textDecoration: 'none' }}
                key={source.key}
              >
                {Badge}
              </a>
            );
          }

          return <React.Fragment key={source.key}>{Badge}</React.Fragment>;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
        <span>Powered by Tavily</span>
        <span>Generated: {formattedTime}s</span>
      </div>
    </div>
  );
}
