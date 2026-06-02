/**
 * StarCV Fallback Utilities
 */

/**
 * Extracts initials from an actor's name for placeholder avatars
 * e.g., "Rajinikanth" -> "RA", "Shah Rukh Khan" -> "SK"
 */
export function getInitials(name) {
  if (!name) return 'CV';
  const cleanName = name.trim().replace(/[^a-zA-Z\s]/g, '');
  const parts = cleanName.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns a fallback value if the target value is empty or null
 */
export function formatValue(value, fallback = 'N/A') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return fallback;
  }
  return value;
}

/**
 * Checks if a social profile is active (has >= 10,000 followers/subs, or is a text bio)
 */
export function isActiveProfile(val) {
  if (!val || val === 'N/A' || String(val).trim() === '') return false;
  const valStr = String(val).trim();
  if (valStr.includes('M') || valStr.includes('K') || valStr.includes('m') || valStr.includes('k')) return true;
  
  // Try to parse numeric digits
  const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return true; // Keep text headlines (like LinkedIn "Influencer...")
  return num >= 10000; // Only show if count is >= 10,000
}
