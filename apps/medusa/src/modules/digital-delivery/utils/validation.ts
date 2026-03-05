import type { FileValidation } from '@realizah/types';

/**
 * Maximum file size: 2GB
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes

/**
 * Allowed MIME types
 */
const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',

  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',

  // Audio
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',

  // Video
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/ogg',

  // Archives
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',

  // Software
  'application/x-msdownload',
  'application/x-deb',
  'application/x-rpm',

  // Other
  'application/json',
  'application/xml',
  'text/xml',
];

/**
 * Validate file for upload
 *
 * @param fileSize - File size in bytes
 * @param mimeType - MIME type
 * @returns Validation result
 */
export function validateFile(fileSize: number, mimeType: string): FileValidation {
  const errors: string[] = [];

  // Check file size
  if (fileSize > MAX_FILE_SIZE) {
    errors.push(`File size exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  if (fileSize === 0) {
    errors.push('File is empty');
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    errors.push(`File type '${mimeType}' is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    maxFileSize: MAX_FILE_SIZE,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
  };
}

/**
 * Format file size to human-readable string
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if MIME type is allowed
 *
 * @param mimeType - MIME type to check
 * @returns True if allowed
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

/**
 * Get file extension from MIME type
 *
 * @param mimeType - MIME type
 * @returns File extension (e.g., "pdf")
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3',
  };

  return mimeToExt[mimeType] || 'bin';
}
