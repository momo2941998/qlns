/**
 * Ranking API Configuration
 *
 * IMPORTANT: This secret key must match the server's RANKING_SECRET_KEY
 * Note: Since this is a client-side application, this key will be visible in the browser
 * This checksum mechanism provides basic protection against casual tampering,
 * but should be combined with server-side validation, rate limiting, and other security measures
 */

export const RANKING_CONFIG = {
  // Secret key for checksum generation (must match server)
  SECRET_KEY: import.meta.env.VITE_RANKING_SECRET_KEY || '',
} as const;
