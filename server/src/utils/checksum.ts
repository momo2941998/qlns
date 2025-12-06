import crypto from 'crypto';

/**
 * Generate checksum from secret key and request body
 * Formula: SHA256({secretKey}:{stringify(body)})
 *
 * @param secretKey - Secret key shared between client and server
 * @param body - Request body object
 * @returns Hex-encoded SHA256 checksum
 */
export function generateChecksum(secretKey: string, body: any): string {
  // Convert body to consistent JSON string
  const bodyString = JSON.stringify(body);

  // Create the data to hash: {secretKey}:{bodyString}
  const data = `${secretKey}:${bodyString}`;

  // Generate SHA256 hash
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  return hash;
}

/**
 * Verify if checksum matches the request body
 *
 * @param checksum - Checksum from client header
 * @param secretKey - Secret key shared between client and server
 * @param body - Request body object
 * @returns true if checksum is valid, false otherwise
 */
export function verifyChecksum(
  checksum: string,
  secretKey: string,
  body: any
): boolean {
  try {
    // Generate expected checksum
    const expectedChecksum = generateChecksum(secretKey, body);

    // Compare checksums (timing-safe comparison)
    return crypto.timingSafeEqual(
      Buffer.from(checksum),
      Buffer.from(expectedChecksum)
    );
  } catch (error) {
    // If checksums have different lengths, timingSafeEqual throws error
    console.error('Checksum verification error:', error);
    return false;
  }
}
