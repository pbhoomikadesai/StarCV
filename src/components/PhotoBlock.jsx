import React, { useState, useEffect } from 'react';
import { getInitials } from '../utils/fallbacks';

export function PhotoBlock({ photoUrl, fallbackUrl, fullName }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    // Reset state whenever inputs change
    let url = photoUrl || fallbackUrl || null;
    if (url && typeof url === 'string' && url.includes('upload.wikimedia.org')) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}origin=*`;
    }
    setImgSrc(url);
    setHasFailed(false);
  }, [photoUrl, fallbackUrl]);

  const handleImageError = () => {
    // If the primary image failed and we have a fallback, switch to the fallback (with CORS parameter)
    let fallbackWithCORS = fallbackUrl;
    if (fallbackWithCORS && typeof fallbackWithCORS === 'string' && fallbackWithCORS.includes('upload.wikimedia.org')) {
      const separator = fallbackWithCORS.includes('?') ? '&' : '?';
      fallbackWithCORS = `${fallbackWithCORS}${separator}origin=*`;
    }

    if (imgSrc !== fallbackWithCORS && fallbackWithCORS) {
      setImgSrc(fallbackWithCORS);
    } else {
      // If the fallback also fails, render initials avatar
      setHasFailed(true);
    }
  };

  if (hasFailed || !imgSrc) {
    return (
      <div className="photo-placeholder" id="photo-block-placeholder">
        {getInitials(fullName)}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={fullName || 'Actor profile'}
      className="photo-img"
      onError={handleImageError}
      crossOrigin="anonymous" // IMPORTANT: Allows html2canvas to download and capture the image inside canvas without CORS taint.
    />
  );
}
