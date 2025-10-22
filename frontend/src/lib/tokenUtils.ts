/**
 * Utility functions for JWT token handling
 */

interface JWTPayload {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decode a JWT token without verification
 * Note: This does NOT verify the signature - only use for reading claims
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  // Add 1 minute buffer to account for clock skew
  const buffer = 60 * 1000;

  return currentTime >= (expirationTime - buffer);
}

/**
 * Get user ID from token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeToken(token);
  return payload?.sub || payload?.userId || null;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

/**
 * Check if token is valid (exists and not expired)
 */
export function isValidToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
}

/**
 * Get remaining time until token expires (in milliseconds)
 */
export function getTokenTimeRemaining(token: string): number {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return 0;
  }

  const remaining = expiration.getTime() - Date.now();
  return Math.max(0, remaining);
}

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}
