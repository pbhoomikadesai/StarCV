import React, { useState, useEffect } from 'react';
import { getInitials } from '../utils/fallbacks';

export function PhotoBlock({ photoUrl, fallbackUrl, fullName }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    // Reset state whenever inputs change
    setImgSrc(photoUrl || fallbackUrl || null);
    setHasFailed(false);
  }, [photoUrl, fallbackUrl]);

  const handleImageError = () => {
    // If the primary image (usually TMDb) failed, attempt the Wikipedia fallback image
    if (imgSrc === photoUrl && fallbackUrl && photoUrl !== fallbackUrl) {
      setImgSrc(fallbackUrl);
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
