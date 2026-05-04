import type { ExecArgs } from '@medusajs/framework/types';
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils';

const p = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const CATEGORIES = [
  { name: 'Feminino', handle: 'feminino', description: 'Fragrâncias para mulheres', rank: 1 },
  { name: 'Masculino', handle: 'masculino', description: 'Fragrâncias para homens', rank: 2 },
  { name: 'Unissex', handle: 'unissex', description: 'Fragrâncias para todos', rank: 3 },
  {
    name: 'Kits & Presentes',
    handle: 'kits-presentes',
    description: 'Kits especiais e embalagens para presente',
    rank: 4,
  },
  { name: 'Exclusivos', handle: 'exclusivos', description: 'Coleção exclusiva Luvée', rank: 5 },
];

const COLLECTIONS = [
  { title: 'Coleção Floral', handle: 'colecao-floral' },
  { title: 'Coleção Oud', handle: 'colecao-oud' },
  { title: 'Coleção Fresh', handle: 'colecao-fresh' },
  { title: 'Kits Especiais', handle: 'kits-especiais' },
];

const PRODUCTS = [
  {
    title: 'La Vie en Rose — Eau de Parfum',
    handle: 'la-vie-en-rose-edp',
    description:
      'Uma explosão de pétalas de rosa damasco, magnólia branca e almíscar suave. Floral romântico de longa duração, perfeito para noites especiais e ocasiões marcantes.',
    thumbnail: p('luv-lavieerose-thumb'),
    images: [p('luv-lavieerose-thumb'), p('luv-lavieerose-2')],
    metadata: { family: 'Floral', badge: 'MAIS VENDIDO', notes: 'Rosa · Magnólia · Almíscar' },
    collection: 'colecao-floral',
    categories: ['feminino'],
    options: [{ title: 'Volume', values: ['30ml', '50ml', '100ml'] }],
    variants: [
      { title: '30ml', sku: 'LVIEDP-30', options: { Volume: '30ml' }, price: 18900 },
      {
        title: '50ml',
        sku: 'LVIEDP-50',
        options: { Volume: '50ml' },
        price: 27900,
        compare_at_price: 32900,
      },
      {
        title: '100ml',
        sku: 'LVIEDP-100',
        options: { Volume: '100ml' },
        price: 41900,
        compare_at_price: 52900,
      },
    ],
  },
  {
    title: 'Nuit Dorée — Eau de Parfum',
    handle: 'nuit-doree-edp',
    description:
      'Notas de baunilha negra, âmbar dourado e sândalo cremoso. Uma fragrância sensual e envolvente, ideal para as noites de inverno e encontros íntimos.',
    thumbnail: p('luv-nuitdoree-thumb'),
    images: [p('luv-nuitdoree-thumb'), p('luv-nuitdoree-2')],
    metadata: { family: 'Oriental', badge: 'NOVO', notes: 'Baunilha · Âmbar · Sândalo' },
    collection: 'colecao-oud',
    categories: ['feminino', 'exclusivos'],
    options: [{ title: 'Volume', values: ['50ml', '100ml'] }],
    variants: [
      { title: '50ml', sku: 'NDEDP-50', options: { Volume: '50ml' }, price: 32900 },
      { title: '100ml', sku: 'NDEDP-100', options: { Volume: '100ml' }, price: 48900 },
    ],
  },
  {
    title: 'Bois de Luxe — Eau de Parfum',
    handle: 'bois-de-luxe-edp',
    description:
      'Madeiras nobres de cedro, patchouli e notas de couro defumado. Masculino, sofisticado e marcante. Para homens que deixam rastro.',
    thumbnail: p('luv-boisluxe-thumb'),
    images: [p('luv-boisluxe-thumb'), p('luv-boisluxe-2')],
    metadata: { family: 'Amadeirado', badge: null, notes: 'Cedro · Patchouli · Couro' },
    collection: 'colecao-oud',
    categories: ['masculino'],
    options: [{ title: 'Volume', values: ['50ml', '100ml'] }],
    variants: [
      { title: '50ml', sku: 'BLDXEDP-50', options: { Volume: '50ml' }, price: 28900 },
      {
        title: '100ml',
        sku: 'BLDXEDP-100',
        options: { Volume: '100ml' },
        price: 44900,
        compare_at_price: 54900,
      },
    ],
  },
  {
    title: 'Aqua Pura — Eau de Toilette',
    handle: 'aqua-pura-edt',
    description:
      'Frescor aquático com notas de bergamota, pepino e base de musgo marinho. Leve, refrescante e unissex — perfeito para o dia a dia.',
    thumbnail: p('luv-aquapura-thumb'),
    images: [p('luv-aquapura-thumb'), p('luv-aquapura-2')],
    metadata: { family: 'Aquático', badge: 'OFERTA', notes: 'Bergamota · Pepino · Musgo' },
    collection: 'colecao-fresh',
    categories: ['unissex'],
    options: [{ title: 'Volume', values: ['50ml', '100ml'] }],
    variants: [
      {
        title: '50ml',
        sku: 'APEDT-50',
        options: { Volume: '50ml' },
        price: 18900,
        compare_at_price: 23900,
      },
      {
        title: '100ml',
        sku: 'APEDT-100',
        options: { Volume: '100ml' },
        price: 29900,
        compare_at_price: 37900,
      },
    ],
  },
  {
    title: 'Velvet Oud — Eau de Parfum',
    handle: 'velvet-oud-edp',
    description:
      'Oud árabe envolto em rosa turca, cardamomo e âmbar. Uma fragrância de luxo inspirada nos grandes clássicos do Oriente Médio, para quem aprecia o extraordinário.',
    thumbnail: p('luv-velvetoud-thumb'),
    images: [p('luv-velvetoud-thumb'), p('luv-velvetoud-2')],
    metadata: { family: 'Oud', badge: 'EXCLUSIVO', notes: 'Oud · Rosa Turca · Cardamomo' },
    collection: 'colecao-oud',
    categories: ['unissex', 'exclusivos'],
    options: [{ title: 'Volume', values: ['50ml', '100ml'] }],
    variants: [
      { title: '50ml', sku: 'VOUEDP-50', options: { Volume: '50ml' }, price: 48900 },
      { title: '100ml', sku: 'VOUEDP-100', options: { Volume: '100ml' }, price: 72900 },
    ],
  },
  {
    title: 'Rosé Magnifique — Body Splash',
    handle: 'rose-magnifique-body-splash',
    description:
      'Body splash inspirado no icônico La Vie en Rose. Notas florais e frutadas para perfumar o corpo com leveza. Aplicação generosa, secagem rápida.',
    thumbnail: p('luv-rosemag-thumb'),
    images: [p('luv-rosemag-thumb')],
    metadata: { family: 'Floral Frutal', badge: 'NOVO', notes: 'Rosa · Framboesa · Almíscar' },
    collection: 'colecao-floral',
    categories: ['feminino'],
    options: [{ title: 'Volume', values: ['200ml'] }],
    variants: [{ title: '200ml', sku: 'RMBSP-200', options: { Volume: '200ml' }, price: 8900 }],
  },
  {
    title: 'Noir Absolu — Eau de Parfum',
    handle: 'noir-absolu-edp',
    description:
      'Fusão intensa de pimenta negra, vetiver defumado e baunilha amarga. O masculino mais sofisticado da coleção — para momentos que pedem ousadia.',
    thumbnail: p('luv-noirabsolu-thumb'),
    images: [p('luv-noirabsolu-thumb'), p('luv-noirabsolu-2')],
    metadata: { family: 'Especiado', badge: null, notes: 'Pimenta Negra · Vetiver · Baunilha' },
    collection: 'colecao-oud',
    categories: ['masculino'],
    options: [{ title: 'Volume', values: ['50ml', '100ml'] }],
    variants: [
      { title: '50ml', sku: 'NAEDP-50', options: { Volume: '50ml' }, price: 31900 },
      {
        title: '100ml',
        sku: 'NAEDP-100',
        options: { Volume: '100ml' },
        price: 46900,
        compare_at_price: 57900,
      },
    ],
  },
  {
    title: 'Kit Presente Floral — La Vie en Rose',
    handle: 'kit-presente-floral',
    description:
      'Kit presente com La Vie en Rose EDP 50ml + Rosé Magnifique Body Splash 200ml em embalagem exclusiva Luvée. Perfeito para presentear alguém especial.',
    thumbnail: p('luv-kitfloral-thumb'),
    images: [p('luv-kitfloral-thumb'), p('luv-kitfloral-2')],
    metadata: { family: 'Kit', badge: 'PRESENTE', notes: 'EDP 50ml + Body Splash 200ml' },
    collection: 'kits-especiais',
    categories: ['kits-presentes', 'feminino'],
    options: [{ title: 'Conteúdo', values: ['EDP 50ml + Body Splash 200ml'] }],
    variants: [
      {
        title: 'EDP 50ml + Body Splash 200ml',
        sku: 'KITFLORAL-01',
        options: { Conteúdo: 'EDP 50ml + Body Splash 200ml' },
        price: 33900,
        compare_at_price: 36800,
      },
    ],
  },
  {
    title: 'Kit Presente Oud — Bois de Luxe',
    handle: 'kit-presente-oud',
    description:
      'Kit presente com Bois de Luxe EDP 50ml + travel size Velvet Oud 10ml em estojo de luxo. Ideal para homens que apreciam madeiras nobres.',
    thumbnail: p('luv-kitoud-thumb'),
    images: [p('luv-kitoud-thumb')],
    metadata: { family: 'Kit', badge: 'PRESENTE', notes: 'EDP 50ml + Travel Size 10ml' },
    collection: 'kits-especiais',
    categories: ['kits-presentes', 'masculino'],
    options: [{ title: 'Conteúdo', values: ['EDP 50ml + Travel Size 10ml'] }],
    variants: [
      {
        title: 'EDP 50ml + Travel Size 10ml',
        sku: 'KITOUD-01',
        options: { Conteúdo: 'EDP 50ml + Travel Size 10ml' },
        price: 31900,
        compare_at_price: 34900,
      },
    ],
  },
  {
    title: 'Mini Coleção Feminina — Travel Set',
    handle: 'mini-colecao-feminina-travel',
    description:
      'Conjunto com 5 miniaturas de 10ml das fragrâncias femininas Luvée: La Vie en Rose, Nuit Dorée, Rosé Magnifique, Aqua Pura e Velvet Oud. Perfeito para descobrir novos aromas.',
    thumbnail: p('luv-miniset-thumb'),
    images: [p('luv-miniset-thumb'), p('luv-miniset-2')],
    metadata: { family: 'Kit', badge: 'EXCLUSIVO', notes: '5x 10ml — todas as famílias' },
    collection: 'kits-especiais',
    categories: ['kits-presentes', 'exclusivos'],
    options: [{ title: 'Conteúdo', values: ['5x 10ml'] }],
    variants: [
      {
        title: '5x 10ml',
        sku: 'MINISET-FEM-01',
        options: { Conteúdo: '5x 10ml' },
        price: 19900,
        compare_at_price: 27500,
      },
    ],
  },
];

const LUVEE_MENU_ITEMS = [
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

export default async function seedLuveeparfum({ container }: ExecArgs) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logger = container.resolve<any>(ContainerRegistrationKeys.LOGGER);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remoteLink = container.resolve<any>(ContainerRegistrationKeys.REMOTE_LINK);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productModule = container.resolve<any>(Modules.PRODUCT);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pricingModule = container.resolve<any>(Modules.PRICING);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const salesChannelModule = container.resolve<any>(Modules.SALES_CHANNEL);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regionModule = container.resolve<any>(Modules.REGION);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiKeyModule = container.resolve<any>(Modules.API_KEY);

  logger.info('🌸 Iniciando seed Luvée Parfum...');

  // --- Guard: skip if luvee products already exist ---
  const existingLuvee = await productModule.listProducts(
    { handle: ['la-vie-en-rose-edp'] },
    { take: 1 },
  );
  if (existingLuvee.length > 0) {
    logger.info('⚠️  Produtos Luvée já existem. Para re-seed, remova os produtos primeiro.');
    return;
  }

  // 1. Região BRL
  let region: { id: string; name: string };
  const existingRegions = await regionModule.listRegions({ currency_code: 'brl' }, { take: 1 });
  if (existingRegions.length > 0) {
    region = existingRegions[0];
  } else {
    [region] = await regionModule.createRegions([
      { name: 'Brasil', currency_code: 'brl', countries: ['br'] },
    ]);
  }
  logger.info(`  ✓ Região: ${region.name}`);

  // 2. Sales Channel — Luvée Parfum
  let salesChannel: { id: string; name: string };
  const existingChannels = await salesChannelModule.listSalesChannels({ name: 'Luvée Parfum' });
  if (existingChannels.length > 0) {
    salesChannel = existingChannels[0];
    logger.info(`  ✓ Sales Channel existente: ${salesChannel.name} (${salesChannel.id})`);
  } else {
    [salesChannel] = await salesChannelModule.createSalesChannels([
      { name: 'Luvée Parfum', description: 'Canal de vendas do e-commerce Luvée Parfum' },
    ]);
    logger.info(`  ✓ Sales Channel criado: ${salesChannel.name} (${salesChannel.id})`);
  }

  // 3. Categorias
  logger.info('  Criando categorias...');
  const catMap: Record<string, string> = {};
  for (const catData of CATEGORIES) {
    try {
      const existing = await productModule.listProductCategories(
        { handle: [catData.handle] },
        { take: 1 },
      );
      if (existing.length > 0) {
        catMap[catData.handle] = existing[0].id;
        continue;
      }
    } catch {
      /* fall through */
    }
    try {
      const [cat] = await productModule.createProductCategories([{ ...catData, is_active: true }]);
      catMap[catData.handle] = cat.id;
    } catch {
      const existing = await productModule.listProductCategories(
        { handle: [catData.handle] },
        { take: 1 },
      );
      if (existing.length > 0) catMap[catData.handle] = existing[0].id;
    }
  }
  logger.info(`  ✓ Categorias: ${Object.keys(catMap).length}`);

  // 4. Coleções
  logger.info('  Criando coleções...');
  const colMap: Record<string, string> = {};
  for (const colData of COLLECTIONS) {
    try {
      const existing = await productModule.listProductCollections(
        { handle: [colData.handle] },
        { take: 1 },
      );
      if (existing.length > 0) {
        colMap[colData.handle] = existing[0].id;
        continue;
      }
    } catch {
      /* fall through */
    }
    try {
      const [col] = await productModule.createProductCollections([colData]);
      colMap[colData.handle] = col.id;
    } catch {
      const existing = await productModule.listProductCollections(
        { handle: [colData.handle] },
        { take: 1 },
      );
      if (existing.length > 0) colMap[colData.handle] = existing[0].id;
    }
  }
  logger.info(`  ✓ Coleções: ${Object.keys(colMap).length}`);

  // 5. Produtos
  logger.info('  Criando produtos...');
  const priceLinks: { variantId: string; price: number; compareAtPrice: number | null }[] = [];

  for (const pd of PRODUCTS) {
    const { variants: variantData, collection, categories, ...productRest } = pd;

    const [product] = await productModule.createProducts([
      {
        ...productRest,
        images: (productRest.images as string[]).map((url: string) => ({ url })),
        status: 'published',
        collection_id: colMap[collection] ?? null,
        categories: categories
          .map((h: string) => ({ id: catMap[h] }))
          .filter((c: { id?: string }) => c.id),
        options: pd.options,
        variants: variantData.map((v) => ({
          title: v.title,
          sku: v.sku,
          options: v.options,
          manage_inventory: false,
        })),
      },
    ]);

    for (const vd of variantData) {
      const actualVariant = product.variants?.find((v: { title: string }) => v.title === vd.title);
      if (actualVariant) {
        priceLinks.push({
          variantId: actualVariant.id,
          price: vd.price,
          compareAtPrice: (vd as { compare_at_price?: number }).compare_at_price ?? null,
        });
      }
    }

    await remoteLink.create([
      {
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      },
    ]);

    logger.info(`    ✓ ${product.title}`);
  }

  // 6. Preços
  logger.info(`  Criando preços para ${priceLinks.length} variantes...`);
  for (const link of priceLinks) {
    const prices = [{ amount: link.price, currency_code: 'brl' }];
    const [priceSet] = await pricingModule.createPriceSets([{ prices }]);
    await remoteLink.create([
      {
        [Modules.PRODUCT]: { variant_id: link.variantId },
        [Modules.PRICING]: { price_set_id: priceSet.id },
      },
    ]);
  }
  logger.info('  ✓ Preços criados');

  // 7. Publishable API Key
  logger.info('  Configurando publishable API key...');
  let apiKey: { id: string; token: string; title: string };
  const existingKeys = await apiKeyModule.listApiKeys({ title: 'luveeparfum-storefront' });
  if (existingKeys.length > 0) {
    apiKey = existingKeys[0];
    logger.info(`  ✓ API Key existente: ${apiKey.title}`);
    logger.info('  NOTE: Token só é exibido na criação. Use admin para revogar/recriar.');
  } else {
    apiKey = await apiKeyModule.createApiKeys({
      title: 'luveeparfum-storefront',
      type: 'publishable',
      created_by: 'seed-luveeparfum',
    });
    logger.info(`  ✓ API Key criada — id: ${apiKey.id}`);
    logger.info(`  🔑 TOKEN: ${apiKey.token}`);
  }

  // Link API key → sales channel
  try {
    await remoteLink.create([
      {
        [Modules.API_KEY]: { publishable_key_id: apiKey.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      },
    ]);
  } catch {
    try {
      await remoteLink.create([
        {
          [Modules.API_KEY]: { api_key_id: apiKey.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
        },
      ]);
    } catch {
      logger.warn(
        '  ⚠️  Não foi possível linkar API key ao sales channel. Link manual necessário.',
      );
    }
  }

  // 8. Menu da Luvée
  logger.info('  Configurando menu Luvée Parfum...');
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storefrontMenuService = container.resolve<any>('storefrontMenuService');
    await storefrontMenuService.upsertMenu({ items: LUVEE_MENU_ITEMS });
    logger.info('  ✓ Menu Luvée Parfum configurado');
  } catch {
    logger.warn(
      '  ⚠️  storefrontMenuService não disponível — menu será usado via mock no storefront',
    );
  }

  logger.info('\n✅ Seed Luvée Parfum concluído!');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info(`📦 Produtos: ${PRODUCTS.length}`);
  logger.info(`🏷️  Categorias: ${Object.keys(catMap).length}`);
  logger.info(`🏬 Coleções: ${Object.keys(colMap).length}`);
  logger.info(`🛍️  Sales Channel: ${salesChannel.name} (${salesChannel.id})`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (existingKeys.length === 0) {
    logger.info('📌 Adicione o TOKEN acima como NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY no Vercel');
  }
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
