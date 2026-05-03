import type { BrandHeroProps } from '@/adapters/brand.adapter';

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&fit=crop`;

export const MOCK_BRANDS: (BrandHeroProps & { slug: string; productCount: number })[] = [
  {
    id: 'brand_01',
    slug: 'nexrun',
    title: 'NexRun',
    description:
      'Performance e inovação em cada passo. Tênis e equipamentos para atletas que não param.',
    coverUrl: u('1542291026-7eec264c27ff'),
    externalUrl: 'https://nexrun.com.br',
    productCount: 18,
  },
  {
    id: 'brand_02',
    slug: 'urbanco',
    title: 'UrbanCo',
    description:
      'Streetwear contemporâneo para quem vive a cidade. Design, atitude e conforto unidos.',
    coverUrl: u('1521572163474-6864f9cf17ab'),
    externalUrl: 'https://urbanco.com.br',
    productCount: 32,
  },
  {
    id: 'brand_03',
    slug: 'precisiontime',
    title: 'PrecisionTime',
    description: 'Relojoaria com precisão e elegância. Cada peça é um objeto de desejo.',
    coverUrl: u('1523275335684-37898b6baf30'),
    externalUrl: 'https://precisiontime.com.br',
    productCount: 9,
  },
  {
    id: 'brand_04',
    slug: 'techgear',
    title: 'TechGear',
    description:
      'Tecnologia de ponta para quem exige o melhor em áudio, conectividade e performance.',
    coverUrl: u('1505740420928-5e560c06d30e'),
    externalUrl: 'https://techgear.com.br',
    productCount: 14,
  },
  {
    id: 'brand_05',
    slug: 'activepro',
    title: 'ActivePro',
    description: 'Feito para quem treina sério. Roupas e acessórios para máxima performance.',
    coverUrl: u('1571902943202-507ec2618e8f'),
    productCount: 24,
  },
  {
    id: 'brand_06',
    slug: 'stylebase',
    title: 'StyleBase',
    description:
      'O básico elevado ao essencial. Peças atemporais que formam a base de qualquer guarda-roupa.',
    coverUrl: u('1626497764746-6bb021e5b5a3'),
    productCount: 20,
  },
];

export function getMockBrand(slug: string) {
  return MOCK_BRANDS.find((b) => b.slug === slug) ?? null;
}
