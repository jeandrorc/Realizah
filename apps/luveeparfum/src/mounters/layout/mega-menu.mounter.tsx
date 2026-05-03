import { Header } from '@/components/layout/header';
import { MegaMenu } from '@/components/layout/mega-menu';
import { MOCK_MENU_ITEMS } from '@/lib/mock/menu';
import type { MenuItem } from '@/lib/mock/menu';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000';

export async function MegaMenuMounter() {
  let items: MenuItem[] = MOCK_MENU_ITEMS;

  try {
    const res = await fetch(`${MEDUSA_URL}/store/storefront-menu`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
      },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = (await res.json()) as { items?: MenuItem[] };
      if (Array.isArray(data?.items) && data.items.length > 0) {
        items = (data.items as MenuItem[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch {
    // use MOCK_MENU_ITEMS
  }

  return (
    <Header menuItems={items}>
      <MegaMenu items={items} />
    </Header>
  );
}
