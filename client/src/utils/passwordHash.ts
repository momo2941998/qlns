/**
 * Hash password using SHA-256
 * @param password - Plain text password
 * @returns Hex string of hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Convert password to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};
