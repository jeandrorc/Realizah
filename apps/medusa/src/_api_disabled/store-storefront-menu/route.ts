import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const storefrontMenuService = req.scope.resolve('storefrontMenuService');
  const menu = await storefrontMenuService.getMenu();
  res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  if (!menu) {
    return res.json({ items: [] });
  }
  return res.json({ items: menu.items });
}
