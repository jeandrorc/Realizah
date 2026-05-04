export interface MenuItem {
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

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'lm1',
    type: 'category',
    label: 'Fragrâncias',
    order: 0,
    children: [
      { id: 'lm1a', type: 'category', label: 'Feminino', categorySlug: 'feminino', order: 0 },
      { id: 'lm1b', type: 'category', label: 'Masculino', categorySlug: 'masculino', order: 1 },
      { id: 'lm1c', type: 'category', label: 'Unissex', categorySlug: 'unissex', order: 2 },
    ],
  },
  {
    id: 'lm2',
    type: 'category',
    label: 'Kits & Presentes',
    categorySlug: 'kits-presentes',
    href: '/products?category=kits-presentes',
    order: 1,
  },
  {
    id: 'lm3',
    type: 'promotion',
    label: 'Exclusivos',
    href: '/products?category=exclusivos',
    badge: 'NOVO',
    badgeColor: 'gold',
    order: 2,
  },
  {
    id: 'lm4',
    type: 'link',
    label: 'Aromas em Destaque',
    href: '/products?featured=true',
    order: 3,
  },
];
