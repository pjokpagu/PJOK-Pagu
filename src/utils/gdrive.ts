/**
 * Utility for converting Google Drive sharing links into direct embeddable image URLs
 */

export const extractGDriveFileId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) return match1[1];
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) return match2[1];
  const match3 = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (match3 && match3[1]) return match3[1];
  return null;
};

export const isGDriveUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('googleusercontent.com');
};

/**
 * Converts a Google Drive link or ID into a direct high-speed image URL for <img> tags.
 * High-speed CDN: https://lh3.googleusercontent.com/d/{id}
 */
export const convertGDriveToDirectImageUrl = (urlOrId: string): string => {
  if (!urlOrId || typeof urlOrId !== 'string') return '';
  const trimmed = urlOrId.trim();
  
  if (trimmed.startsWith('https://lh3.googleusercontent.com/d/')) {
    return trimmed;
  }

  const fileId = extractGDriveFileId(trimmed) || (trimmed.length >= 25 && !trimmed.includes('/') ? trimmed : null);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
};
