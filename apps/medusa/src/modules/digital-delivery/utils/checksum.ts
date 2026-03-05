import { createHash } from 'crypto';

/**
 * Calculate SHA-256 checksum of a buffer
 */
export function calculateChecksum(buffer: Buffer): string {
  const hash = createHash('sha256');
  hash.update(buffer);
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Verify checksum of a buffer
 */
export function verifyChecksum(buffer: Buffer, expectedChecksum: string): boolean {
  const actualChecksum = calculateChecksum(buffer);
  return actualChecksum === expectedChecksum;
}

/**
 * Extract algorithm and hash from checksum string
 */
export function parseChecksum(checksum: string): {
  algorithm: string;
  hash: string;
} {
  const [algorithm, hash] = checksum.split(':');
  return { algorithm, hash };
}
