import type { CategoryBannerProps } from '@/adapters/category.adapter';

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&fit=crop`;

export const MOCK_CATEGORIES: (CategoryBannerProps & { slug: string; iconEmoji: string })[] = [
  {
    id: 'cat_01',
    slug: 'tenis-calcados',
    title: 'Tênis & Calçados',
    description: 'Os melhores tênis para correr, treinar e arrasar no dia a dia.',
    imageUrl: u('1542291026-7eec264c27ff'),
    productCount: 48,
    iconEmoji: '👟',
  },
  {
    id: 'cat_02',
    slug: 'roupas-moda',
    title: 'Roupas & Moda',
    description: 'Looks para todos os estilos — do casual ao esportivo.',
    imageUrl: u('1521572163474-6864f9cf17ab'),
    productCount: 92,
    iconEmoji: '👕',
  },
  {
    id: 'cat_03',
    slug: 'acessorios',
    title: 'Acessórios',
    description: 'Relógios, óculos, bonés e tudo que completa o visual.',
    imageUrl: u('1523275335684-37898b6baf30'),
    productCount: 35,
    iconEmoji: '⌚',
  },
  {
    id: 'cat_04',
    slug: 'eletronicos',
    title: 'Eletrônicos',
    description: 'Fones, gadgets e tecnologia para o seu dia a dia.',
    imageUrl: u('1505740420928-5e560c06d30e'),
    productCount: 27,
    iconEmoji: '🎧',
  },
  {
    id: 'cat_05',
    slug: 'esportes-fitness',
    title: 'Esportes & Fitness',
    description: 'Equipamentos e roupas para seus treinos e aventuras.',
    imageUrl: u('1571902943202-507ec2618e8f'),
    productCount: 61,
    iconEmoji: '💪',
  },
  {
    id: 'cat_06',
    slug: 'mochilas-bags',
    title: 'Mochilas & Bags',
    description: 'Mochilas urbanas, esportivas e de viagem.',
    imageUrl: u('1553062407-98eeb64c6a62'),
    productCount: 19,
    iconEmoji: '🎒',
  },
  {
    id: 'cat_07',
    slug: 'casa-lifestyle',
    title: 'Casa & Lifestyle',
    description: 'Produtos para tornar sua casa e rotina mais incríveis.',
    imageUrl: u('1567538096630-e4a32703f35a'),
    productCount: 44,
    iconEmoji: '🏠',
  },
  {
    id: 'cat_08',
    slug: 'cursos-online',
    title: 'Cursos Online',
    description: 'Aprenda novas habilidades com especialistas do mercado.',
    imageUrl: u('1522202176988-66273c2fd55f'),
    productCount: 23,
    iconEmoji: '📚',
  },
];

export function getMockCategory(slug: string) {
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
