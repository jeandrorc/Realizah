import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateDigitalProductInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalProductService = req.scope.resolve('digitalProductService');

  const { type, requiredTier } = req.query;

  const products = await digitalProductService.listProducts({
    type,
    requiredTier,
  });

  res.json({ products });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const digitalProductService = req.scope.resolve('digitalProductService');

  const data: CreateDigitalProductInput = req.body;

  const product = await digitalProductService.createProduct(data);

  res.status(201).json({ product });
}
