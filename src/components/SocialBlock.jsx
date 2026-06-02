import React from 'react';
import { isActiveProfile } from '../utils/fallbacks';

// Custom inline SVG icons because recent versions of lucide-react do not bundle brand icons
const YoutubeIcon = ({ size = 15, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const InstagramIcon = ({ size = 15, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 15, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = ({ size = 15, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function SocialBlock({ socialData }) {
  if (!socialData) return null;

  const { youtube, instagram, facebook, linkedin } = socialData;

  const channels = [
    {
      key: 'youtube',
      name: 'YouTube',
      icon: <YoutubeIcon size={15} style={{ color: '#ef4444' }} />,
      val: youtube?.subscribers,
      url: youtube?.url,
      label: youtube?.channel_name || 'Official Channel',
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: <InstagramIcon size={15} style={{ color: '#ec4899' }} />,
      val: instagram?.followers,
      url: instagram?.url,
      label: instagram?.handle || 'Official Handle',
    },
    {
      key: 'facebook',
      name: 'Facebook',
      icon: <FacebookIcon size={15} style={{ color: '#3b82f6' }} />,
      val: facebook?.likes,
      url: facebook?.url,
      label: facebook?.page_name || 'Official Page',
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: <LinkedinIcon size={15} style={{ color: '#0a66c2' }} />,
      val: linkedin?.followers || 'Connected',
      url: linkedin?.url,
      label: linkedin?.headline || 'Professional Profile',
    }
  ];

  // Filters out social rows where they are not active (threshold: 10k)
  const activeChannels = channels.filter(ch => ch.url && isActiveProfile(ch.val));

  if (activeChannels.length === 0) return null;

  return (
    <div className="social-row-grid">
      {activeChannels.map(ch => (
        <div className="social-pill" key={ch.key}>
          <div className="social-header">
            {ch.icon}
            <span>{ch.name}</span>
          </div>
          <div className="social-val">
            {ch.val && ch.val !== 'N/A' ? ch.val : 'Active'}
          </div>
          <div className="social-desc">
            {ch.url ? (
              <a 
                href={ch.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {ch.label}
              </a>
            ) : (
              ch.label
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
