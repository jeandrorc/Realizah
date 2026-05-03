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
    id: 'm1',
    type: 'category',
    label: 'Produtos',
    order: 0,
    children: [
      {
        id: 'm1a',
        type: 'category',
        label: 'Tênis & Calçados',
        categorySlug: 'tenis-calcados',
        order: 0,
      },
      {
        id: 'm1b',
        type: 'category',
        label: 'Roupas & Moda',
        categorySlug: 'roupas-moda',
        order: 1,
      },
      { id: 'm1c', type: 'category', label: 'Acessórios', categorySlug: 'acessorios', order: 2 },
      { id: 'm1d', type: 'category', label: 'Eletrônicos', categorySlug: 'eletronicos', order: 3 },
      {
        id: 'm1e',
        type: 'category',
        label: 'Esportes & Fitness',
        categorySlug: 'esportes-fitness',
        order: 4,
      },
      {
        id: 'm1f',
        type: 'category',
        label: 'Mochilas & Bags',
        categorySlug: 'mochilas-bags',
        order: 5,
      },
    ],
  },
  {
    id: 'm2',
    type: 'promotion',
    label: 'Ofertas',
    href: '/products?sort=discount',
    badge: '-30%',
    badgeColor: 'fire',
    order: 1,
  },
  { id: 'm3', type: 'link', label: 'Cursos', href: '/courses', order: 2 },
  { id: 'm4', type: 'link', label: 'Assinatura', href: '/subscription', order: 3 },
];
