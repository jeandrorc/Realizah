import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const digitalFileService = req.scope.resolve('digitalFileService');
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { id } = req.params;
  const { name, description, fileBuffer, mimeType } = req.body;

  // TODO: Handle multipart/form-data file upload
  // This is a simplified version - in production, use multer or similar

  if (!fileBuffer || !mimeType) {
    return res.status(400).json({
      error: 'Missing required fields: fileBuffer, mimeType',
    });
  }

  const buffer = Buffer.from(fileBuffer, 'base64');

  const file = await digitalFileService.uploadFile(id, name, buffer, mimeType, description);

  // Update product file size
  await digitalProductService.incrementFileSize(id, file.fileSize);

  res.status(201).json({ file });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalFileService = req.scope.resolve('digitalFileService');

  const { id } = req.params;

  const files = await digitalFileService.getFilesByProduct(id);

  res.json({ files });
}
