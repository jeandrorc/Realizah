import { MedusaService } from '@medusajs/framework/utils';
import type { DigitalFile as DigitalFileType } from '@realizah/types';
import { calculateChecksum, uploadToS3, deleteFromS3, generateS3Key, validateFile } from '../utils';

class DigitalFileService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DigitalFile: require('../models/digital-file').default,
}) {
  async uploadFile(
    digitalProductId: string,
    name: string,
    buffer: Buffer,
    mimeType: string,
    description?: string,
  ): Promise<DigitalFileType> {
    // Validate file
    const validation = validateFile(buffer.length, mimeType);
    if (!validation.isValid) {
      throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
    }

    // Calculate checksum
    const checksum = calculateChecksum(buffer);

    // Generate S3 key
    const storageKey = generateS3Key(name);

    // Upload to S3
    await uploadToS3(storageKey, buffer, mimeType);

    // Create file record
    const file = await this.createDigitalFiles({
      digitalProductId,
      name,
      description,
      storageKey,
      fileSize: buffer.length,
      mimeType,
      checksum,
    });

    return file as DigitalFileType;
  }

  async listFiles(filters?: { digitalProductId?: string }): Promise<DigitalFileType[]> {
    const files = await this.listDigitalFiles(filters);
    return files as DigitalFileType[];
  }

  async retrieveFile(fileId: string): Promise<DigitalFileType> {
    const file = await this.retrieveDigitalFile(fileId);
    if (!file) {
      throw new Error(`Digital file with id ${fileId} not found`);
    }
    return file as DigitalFileType;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.retrieveFile(fileId);

    // Delete from S3
    await deleteFromS3(file.storageKey);

    // Delete from database
    await this.deleteDigitalFiles(fileId);
  }

  async getFilesByProduct(digitalProductId: string): Promise<DigitalFileType[]> {
    return this.listFiles({ digitalProductId });
  }

  async getTotalFileSize(digitalProductId: string): Promise<number> {
    const files = await this.getFilesByProduct(digitalProductId);
    return files.reduce((total, file) => total + file.fileSize, 0);
  }

  async verifyFileIntegrity(fileId: string, buffer: Buffer): Promise<boolean> {
    const file = await this.retrieveFile(fileId);
    const actualChecksum = calculateChecksum(buffer);
    return actualChecksum === file.checksum;
  }
}

export default DigitalFileService;
