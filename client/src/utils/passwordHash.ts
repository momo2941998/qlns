import { sha256 } from 'js-sha256';

/**
 * Hash password using SHA-256
 * @param password - Plain text password
 * @returns Hex string of hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Hash using SHA-256 from js-sha256 library
  // This works in all contexts (HTTP, HTTPS, localhost, IP)
  return sha256(password);
};
