import { RANKING_CONFIG } from '../config/ranking.config';

/**
 * Generate SHA256 checksum for request body
 * Formula: SHA256({secretKey}:{JSON.stringify(body)})
 *
 * @param body - Request body object to generate checksum for
 * @returns Promise<string> - Hex-encoded SHA256 checksum
 */
export async function generateChecksum(body: any): Promise<string> {
  // Convert body to consistent JSON string
  const bodyString = JSON.stringify(body);

  // Create the data to hash: {secretKey}:{bodyString}
  const data = `${RANKING_CONFIG.SECRET_KEY}:${bodyString}`;

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Generate SHA256 hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Verify if checksum matches the request body (for testing purposes)
 *
 * @param checksum - Checksum to verify
 * @param body - Request body object
 * @returns Promise<boolean> - true if checksum is valid
 */
export async function verifyChecksum(checksum: string, body: any): Promise<boolean> {
  const expectedChecksum = await generateChecksum(body);
  return checksum === expectedChecksum;
}
