import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const storefrontMenuService = req.scope.resolve('storefrontMenuService');
  const menu = await storefrontMenuService.getMenu();
  if (!menu) {
    return res.json({ menu: null, items: [] });
  }
  return res.json({ menu, items: menu.items });
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const storefrontMenuService = req.scope.resolve('storefrontMenuService');
  const { items } = req.body as { items?: unknown[] };
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array' });
  }
  const result = await storefrontMenuService.upsertMenu({ items });
  return res.json({ menu: result, items: result.items });
}
