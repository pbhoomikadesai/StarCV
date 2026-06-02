import React from 'react';
import { PhotoBlock } from './PhotoBlock';
import { SocialBlock } from './SocialBlock';
import { SourcesBar } from './SourcesBar';
import { formatValue } from '../utils/fallbacks';
import { Film, Trophy, User, Share2, MapPin, Briefcase, Globe, Languages } from 'lucide-react';

export function Resume({ data, rawPhotoUrls, apiStatus, durationMs, elementId }) {
  if (!data) return null;

  const { profile = {}, work = {}, awards = [], social = {}, skills = [] } = data;

  const fullName = formatValue(profile.full_name, 'Actor Name');
  const alsoKnownAs = formatValue(profile.also_known_as, '');
  const profession = formatValue(profile.profession, 'Indian Actor');
  const filmIndustry = formatValue(profile.film_industry, 'Indian Cinema');
  const debutYear = formatValue(profile.debut_year, 'N/A');
  const activeYears = formatValue(profile.active_years, 'N/A');
  const dob = formatValue(profile.dob, 'N/A');
  const birthplace = formatValue(profile.birthplace, 'N/A');
  const location = formatValue(profile.location, 'Mumbai, Maharashtra, India');
  const summary = formatValue(profile.professional_summary, 'No professional summary details found.');
  const website = formatValue(profile.official_website, '');
  const languages = formatValue(profile.languages, '');

  return (
    <div className="resume-scale-outer">
      <div className="resume-wrapper" id={elementId}>
        <div>
          {/* Resume Header Section */}
          <div className="resume-header">
            <div className="photo-container">
              <PhotoBlock 
                photoUrl={profile.photo_url} 
                fallbackUrl={rawPhotoUrls?.wikipedia} 
                fullName={fullName}
              />
            </div>
            <div className="profile-info">
              <h1 className="actor-name">{fullName}</h1>
              {alsoKnownAs && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  A.K.A: {alsoKnownAs}
                </div>
              )}
              <div className="actor-sub">
                {filmIndustry} &nbsp;|&nbsp; {profession}
              </div>
              
              {/* Contact / Bio Metadata Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {location && location !== 'N/A' && location.trim() !== '' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} />
                    {location}
                  </span>
                )}
                {website && website !== 'N/A' && website.trim() !== '' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} style={{ color: 'var(--accent-cyan)' }} />
                    <a 
                      href={website.startsWith('http') ? website : `https://${website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {website.replace(/^(https?:\/\/)?(www\.)?/, '')}
                    </a>
                  </span>
                )}
                {languages && languages !== 'N/A' && languages.trim() !== '' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Languages size={12} style={{ color: 'var(--accent-cyan)' }} />
                    Speaks: {languages}
                  </span>
                )}
              </div>

              <div className="actor-meta-grid">
                {debutYear && debutYear !== 'N/A' && (
                  <div className="actor-meta-item">
                    <span className="meta-label">Debut Year:</span> {debutYear}
                  </div>
                )}
                {activeYears && activeYears !== 'N/A' && (
                  <div className="actor-meta-item">
                    <span className="meta-label">Active Years:</span> {activeYears}
                  </div>
                )}
                {dob && dob !== 'N/A' && (
                  <div className="actor-meta-item">
                    <span className="meta-label">D.O.B:</span> {dob}
                  </div>
                )}
                {birthplace && birthplace !== 'N/A' && (
                  <div className="actor-meta-item">
                    <span className="meta-label">Birthplace:</span> {birthplace}
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="resume-divider" />

          {/* Professional Summary Section */}
          <div style={{ marginBottom: '8px' }}>
            <h2 className="section-title">
              <User size={15} style={{ color: 'var(--accent-indigo)' }} />
              Artist Profile
            </h2>
            <p className="about-text">{summary}</p>
          </div>

          <hr className="resume-divider" />

          {/* Core Skills & Expertise Section */}
          <div style={{ marginBottom: '8px' }}>
            <h2 className="section-title">
              <Briefcase size={15} style={{ color: 'var(--accent-indigo)' }} />
              Special Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(99, 102, 241, 0.06)', 
                      border: '1px solid rgba(99, 102, 241, 0.15)', 
                      padding: '4px 10px', 
                      borderRadius: '15px', 
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Method Acting, Stunt Choreography, Screen Performance
                </span>
              )}
            </div>
          </div>

          <hr className="resume-divider" />

          {/* Work & Awards Double Columns */}
          <div className="resume-columns">
            {/* Experience column */}
            <div>
              <h2 className="section-title">
                <Film size={15} style={{ color: 'var(--accent-indigo)' }} />
                Selected Filmography
              </h2>
              <ul className="work-list">
                {work?.key_credits && work.key_credits.length > 0 ? (
                  work.key_credits.slice(0, 5).map((film, index) => (
                    <li className="work-item" key={index} style={{ marginBottom: '12px' }}>
                      • <span className="item-bold">{film.title}</span>{film.year && String(film.year).trim() !== '' ? ` (${film.year})` : ''}
                      {film.role && (
                        <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginLeft: '6px' }}>
                          as {film.role}
                        </span>
                      )}
                      {film.contribution_highlight && (
                        <div style={{ 
                          fontSize: '0.78rem', 
                          color: 'var(--text-secondary)', 
                          marginTop: '2px', 
                          fontStyle: 'italic', 
                          paddingLeft: '8px', 
                          borderLeft: '1px solid var(--border-color)' 
                        }}>
                          {film.contribution_highlight}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="work-item" style={{ color: 'var(--text-muted)' }}>
                    No movies listed.
                  </li>
                )}
              </ul>
            </div>

            {/* Awards column */}
            <div>
              <h2 className="section-title">
                <Trophy size={15} style={{ color: 'var(--accent-indigo)' }} />
                Awards & Accolades
              </h2>
              <ul className="awards-list">
                {awards && awards.length > 0 ? (
                  awards.slice(0, 5).map((award, index) => (
                    <li className="award-item" key={index} style={{ marginBottom: '10px' }}>
                      • <span className="item-bold">{award.award_name}</span>{award.year && String(award.year).trim() !== '' ? ` (${award.year})` : ''}
                      {award.category && (
                        <div className="item-subtext">{award.category}</div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="award-item" style={{ color: 'var(--text-muted)' }}>
                    No major awards listed.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <hr className="resume-divider" />

          {/* Social Presence Section */}
          <div style={{ marginBottom: '10px' }}>
            <h2 className="section-title">
              <Share2 size={15} style={{ color: 'var(--accent-indigo)' }} />
              Social Media Presence
            </h2>
            <SocialBlock socialData={social} />
          </div>
        </div>

        {/* Sources footer bar */}
        <SourcesBar 
          apiStatus={apiStatus} 
          durationMs={durationMs} 
          social={social}
          urls={{
            wikipedia: fullName ? `https://en.wikipedia.org/wiki/${encodeURIComponent(fullName)}` : null,
            youtube: social?.youtube?.url,
            instagram: social?.instagram?.url,
            facebook: social?.facebook?.url,
            linkedin: social?.linkedin?.url
          }}
        />
      </div>
    </div>
  );
}
