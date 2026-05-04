import type { ProductCardProps, ProductDetailProps } from '@/adapters/product.adapter';

const p = (seed: string, w = 600) => `https://picsum.photos/seed/${seed}/${w}/${w}`;

export const MOCK_PRODUCTS: ProductDetailProps[] = [
  {
    id: 'prod_lv01',
    title: 'La Vie en Rose — Eau de Parfum',
    handle: 'la-vie-en-rose-edp',
    price: 'R$ 279,90',
    originalPrice: 'R$ 329,90',
    discountPercent: 15,
    imageUrl: p('luv-lavieerose-thumb'),
    images: [p('luv-lavieerose-thumb'), p('luv-lavieerose-2')],
    brand: 'Luvée Parfum',
    badge: 'MAIS VENDIDO',
    variantId: 'var_lv01',
    description:
      'Uma explosão de pétalas de rosa damasco, magnólia branca e almíscar suave. Floral romântico de longa duração, perfeito para noites especiais e ocasiões marcantes.',
    variants: [
      {
        id: 'var_lv01',
        title: '30ml',
        price: 'R$ 189,90',
        inStock: true,
        options: { Volume: '30ml' },
      },
      {
        id: 'var_lv02',
        title: '50ml',
        price: 'R$ 279,90',
        originalPrice: 'R$ 329,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv03',
        title: '100ml',
        price: 'R$ 419,90',
        originalPrice: 'R$ 529,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: { Família: 'Floral', Notas: 'Rosa · Magnólia · Almíscar', Concentração: 'EDP' },
  },
  {
    id: 'prod_lv02',
    title: 'Nuit Dorée — Eau de Parfum',
    handle: 'nuit-doree-edp',
    price: 'R$ 329,90',
    imageUrl: p('luv-nuitdoree-thumb'),
    images: [p('luv-nuitdoree-thumb'), p('luv-nuitdoree-2')],
    brand: 'Luvée Parfum',
    badge: 'NOVO',
    variantId: 'var_lv04',
    description:
      'Notas de baunilha negra, âmbar dourado e sândalo cremoso. Uma fragrância sensual e envolvente, ideal para as noites de inverno e encontros íntimos.',
    variants: [
      {
        id: 'var_lv04',
        title: '50ml',
        price: 'R$ 329,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv05',
        title: '100ml',
        price: 'R$ 489,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: { Família: 'Oriental', Notas: 'Baunilha · Âmbar · Sândalo', Concentração: 'EDP' },
  },
  {
    id: 'prod_lv03',
    title: 'Bois de Luxe — Eau de Parfum',
    handle: 'bois-de-luxe-edp',
    price: 'R$ 289,90',
    originalPrice: 'R$ 549,90',
    discountPercent: 47,
    imageUrl: p('luv-boisluxe-thumb'),
    images: [p('luv-boisluxe-thumb'), p('luv-boisluxe-2')],
    brand: 'Luvée Parfum',
    badge: null,
    variantId: 'var_lv06',
    description:
      'Madeiras nobres de cedro, patchouli e notas de couro defumado. Masculino, sofisticado e marcante. Para homens que deixam rastro.',
    variants: [
      {
        id: 'var_lv06',
        title: '50ml',
        price: 'R$ 289,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv07',
        title: '100ml',
        price: 'R$ 449,90',
        originalPrice: 'R$ 549,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: { Família: 'Amadeirado', Notas: 'Cedro · Patchouli · Couro', Concentração: 'EDP' },
  },
  {
    id: 'prod_lv04',
    title: 'Aqua Pura — Eau de Toilette',
    handle: 'aqua-pura-edt',
    price: 'R$ 189,90',
    originalPrice: 'R$ 239,90',
    discountPercent: 21,
    imageUrl: p('luv-aquapura-thumb'),
    images: [p('luv-aquapura-thumb'), p('luv-aquapura-2')],
    brand: 'Luvée Parfum',
    badge: 'OFERTA',
    variantId: 'var_lv08',
    description:
      'Frescor aquático com notas de bergamota, pepino e base de musgo marinho. Leve, refrescante e unissex — perfeito para o dia a dia.',
    variants: [
      {
        id: 'var_lv08',
        title: '50ml',
        price: 'R$ 189,90',
        originalPrice: 'R$ 239,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv09',
        title: '100ml',
        price: 'R$ 299,90',
        originalPrice: 'R$ 379,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: { Família: 'Aquático', Notas: 'Bergamota · Pepino · Musgo', Concentração: 'EDT' },
  },
  {
    id: 'prod_lv05',
    title: 'Velvet Oud — Eau de Parfum',
    handle: 'velvet-oud-edp',
    price: 'R$ 489,90',
    imageUrl: p('luv-velvetoud-thumb'),
    images: [p('luv-velvetoud-thumb'), p('luv-velvetoud-2')],
    brand: 'Luvée Parfum',
    badge: 'EXCLUSIVO',
    variantId: 'var_lv10',
    description:
      'Oud árabe envolto em rosa turca, cardamomo e âmbar. Uma fragrância de luxo inspirada nos grandes clássicos do Oriente Médio, para quem aprecia o extraordinário.',
    variants: [
      {
        id: 'var_lv10',
        title: '50ml',
        price: 'R$ 489,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv11',
        title: '100ml',
        price: 'R$ 729,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: { Família: 'Oud', Notas: 'Oud · Rosa Turca · Cardamomo', Concentração: 'EDP' },
  },
  {
    id: 'prod_lv06',
    title: 'Rosé Magnifique — Body Splash',
    handle: 'rose-magnifique-body-splash',
    price: 'R$ 89,90',
    imageUrl: p('luv-rosemag-thumb'),
    images: [p('luv-rosemag-thumb')],
    brand: 'Luvée Parfum',
    badge: 'NOVO',
    variantId: 'var_lv12',
    description:
      'Body splash inspirado no icônico La Vie en Rose. Notas florais e frutadas para perfumar o corpo com leveza. Aplicação generosa, secagem rápida.',
    variants: [
      {
        id: 'var_lv12',
        title: '200ml',
        price: 'R$ 89,90',
        inStock: true,
        options: { Volume: '200ml' },
      },
    ],
    attributes: {
      Família: 'Floral Frutal',
      Notas: 'Rosa · Framboesa · Almíscar',
      Tipo: 'Body Splash',
    },
  },
  {
    id: 'prod_lv07',
    title: 'Noir Absolu — Eau de Parfum',
    handle: 'noir-absolu-edp',
    price: 'R$ 319,90',
    originalPrice: 'R$ 579,90',
    discountPercent: 45,
    imageUrl: p('luv-noirabsolu-thumb'),
    images: [p('luv-noirabsolu-thumb'), p('luv-noirabsolu-2')],
    brand: 'Luvée Parfum',
    badge: null,
    variantId: 'var_lv13',
    description:
      'Fusão intensa de pimenta negra, vetiver defumado e baunilha amarga. O masculino mais sofisticado da coleção — para momentos que pedem ousadia.',
    variants: [
      {
        id: 'var_lv13',
        title: '50ml',
        price: 'R$ 319,90',
        inStock: true,
        options: { Volume: '50ml' },
      },
      {
        id: 'var_lv14',
        title: '100ml',
        price: 'R$ 469,90',
        originalPrice: 'R$ 579,90',
        inStock: true,
        options: { Volume: '100ml' },
      },
    ],
    attributes: {
      Família: 'Especiado',
      Notas: 'Pimenta Negra · Vetiver · Baunilha',
      Concentração: 'EDP',
    },
  },
  {
    id: 'prod_lv08',
    title: 'Kit Presente Floral — La Vie en Rose',
    handle: 'kit-presente-floral',
    price: 'R$ 339,90',
    originalPrice: 'R$ 368,80',
    discountPercent: 8,
    imageUrl: p('luv-kitfloral-thumb'),
    images: [p('luv-kitfloral-thumb'), p('luv-kitfloral-2')],
    brand: 'Luvée Parfum',
    badge: 'PRESENTE',
    variantId: 'var_lv15',
    description:
      'Kit presente com La Vie en Rose EDP 50ml + Rosé Magnifique Body Splash 200ml em embalagem exclusiva Luvée. Perfeito para presentear alguém especial.',
    variants: [
      {
        id: 'var_lv15',
        title: 'EDP 50ml + Body Splash 200ml',
        price: 'R$ 339,90',
        originalPrice: 'R$ 368,80',
        inStock: true,
        options: { Conteúdo: 'EDP 50ml + Body Splash 200ml' },
      },
    ],
    attributes: { Conteúdo: 'EDP 50ml + Body Splash 200ml', Embalagem: 'Caixa presente exclusiva' },
  },
  {
    id: 'prod_lv09',
    title: 'Kit Presente Oud — Bois de Luxe',
    handle: 'kit-presente-oud',
    price: 'R$ 319,90',
    originalPrice: 'R$ 349,90',
    discountPercent: 9,
    imageUrl: p('luv-kitoud-thumb'),
    images: [p('luv-kitoud-thumb')],
    brand: 'Luvée Parfum',
    badge: 'PRESENTE',
    variantId: 'var_lv16',
    description:
      'Kit presente com Bois de Luxe EDP 50ml + travel size Velvet Oud 10ml em estojo de luxo. Ideal para homens que apreciam madeiras nobres.',
    variants: [
      {
        id: 'var_lv16',
        title: 'EDP 50ml + Travel Size 10ml',
        price: 'R$ 319,90',
        originalPrice: 'R$ 349,90',
        inStock: true,
        options: { Conteúdo: 'EDP 50ml + Travel Size 10ml' },
      },
    ],
    attributes: { Conteúdo: 'EDP 50ml + Travel Size 10ml', Embalagem: 'Estojo de luxo' },
  },
  {
    id: 'prod_lv10',
    title: 'Mini Coleção Feminina — Travel Set',
    handle: 'mini-colecao-feminina-travel',
    price: 'R$ 199,90',
    originalPrice: 'R$ 275,00',
    discountPercent: 27,
    imageUrl: p('luv-miniset-thumb'),
    images: [p('luv-miniset-thumb'), p('luv-miniset-2')],
    brand: 'Luvée Parfum',
    badge: 'EXCLUSIVO',
    variantId: 'var_lv17',
    description:
      'Conjunto com 5 miniaturas de 10ml das fragrâncias femininas Luvée: La Vie en Rose, Nuit Dorée, Rosé Magnifique, Aqua Pura e Velvet Oud. Perfeito para descobrir novos aromas.',
    variants: [
      {
        id: 'var_lv17',
        title: '5x 10ml',
        price: 'R$ 199,90',
        originalPrice: 'R$ 275,00',
        inStock: true,
        options: { Conteúdo: '5x 10ml' },
      },
    ],
    attributes: { Conteúdo: '5 miniaturas 10ml', Tamanho: 'Travel size', Fragrâncias: '5 aromas' },
  },
];

export function getMockProduct(handle: string): ProductDetailProps | null {
  return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export function getMockProducts(
  options: {
    limit?: number;
    categorySlug?: string;
    brandName?: string;
    featured?: boolean;
  } = {},
): ProductCardProps[] {
  const categoryMap: Record<string, string[]> = {
    feminino: ['prod_lv01', 'prod_lv02', 'prod_lv06', 'prod_lv08', 'prod_lv10'],
    masculino: ['prod_lv03', 'prod_lv07', 'prod_lv09'],
    unissex: ['prod_lv04', 'prod_lv05'],
    'kits-presentes': ['prod_lv08', 'prod_lv09', 'prod_lv10'],
    exclusivos: ['prod_lv02', 'prod_lv05', 'prod_lv10'],
  };

  let list = [...MOCK_PRODUCTS];

  if (options.categorySlug) {
    const ids = categoryMap[options.categorySlug];
    if (ids) list = list.filter((p) => ids.includes(p.id));
  }

  if (options.brandName) {
    list = list.filter((p) => p.brand?.toLowerCase() === options.brandName?.toLowerCase());
  }

  if (options.featured) {
    list = list.filter((p) => p.badge !== null).slice(0, 8);
  }

  return list.slice(0, options.limit ?? 20).map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    imageUrl: p.imageUrl,
    brand: p.brand,
    badge: p.badge,
    variantId: p.variantId,
  }));
}
