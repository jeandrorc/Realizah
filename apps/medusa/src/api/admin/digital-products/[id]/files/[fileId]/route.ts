import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const digitalFileService = req.scope.resolve('digitalFileService');
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { id, fileId } = req.params;

  const file = await digitalFileService.retrieveFile(fileId);

  await digitalFileService.deleteFile(fileId);

  // Update product file size
  await digitalProductService.decrementFileSize(id, file.fileSize);

  res.status(204).send();
}
