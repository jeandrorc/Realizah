import { NextResponse } from 'next/server';
import { MOCK_MENU_ITEMS } from '@/lib/mock/menu';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000';

export async function GET() {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/storefront-menu`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ items: MOCK_MENU_ITEMS });
    }

    const data = (await res.json()) as { items?: unknown[] };
    const items =
      Array.isArray(data?.items) && data.items.length > 0 ? data.items : MOCK_MENU_ITEMS;

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: MOCK_MENU_ITEMS });
  }
}
