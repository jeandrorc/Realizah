// @ts-nocheck - MedusaService
import { MedusaService } from '@medusajs/framework/utils';
import StorefrontMenu from './models/storefront-menu';

interface MenuItem {
  id: string;
  type: 'category' | 'promotion' | 'link' | 'banner' | 'divider';
  label: string;
  href?: string;
  order: number;
  categoryId?: string;
  categorySlug?: string;
  badge?: string;
  badgeColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  position?: 'left' | 'right' | 'bottom';
  children?: MenuItem[];
}

class StorefrontMenuService extends MedusaService({
  StorefrontMenu,
}) {
  async getMenu(name = 'header_main'): Promise<{ items: MenuItem[] } | null> {
    const menus = await this.listStorefrontMenus({ name });
    const menu = menus[0];
    if (!menu || !menu.items) return null;
    return { items: menu.items as MenuItem[] };
  }

  async upsertMenu(data: { name?: string; items: MenuItem[] }): Promise<{ items: MenuItem[] }> {
    const name = data.name ?? 'header_main';
    const menus = await this.listStorefrontMenus({ name });
    const sorted = [...(data.items || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (menus.length > 0) {
      await this.updateStorefrontMenus(menus[0].id, { items: sorted });
      return { items: sorted };
    }

    const [created] = await this.createStorefrontMenus({
      name,
      items: sorted,
    });
    return { items: (created as { items: MenuItem[] })?.items ?? sorted };
  }
}

export default StorefrontMenuService;
