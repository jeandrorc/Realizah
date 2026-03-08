// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateDigitalProductInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { id } = req.params;

  const product = await digitalProductService.retrieveProduct(id);

  res.json({ product });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { id } = req.params;
  const data: UpdateDigitalProductInput = req.body;

  const product = await digitalProductService.updateProduct(id, data);

  res.json({ product });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { id } = req.params;

  await digitalProductService.deleteProduct(id);

  res.status(204).send();
}
