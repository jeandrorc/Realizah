import type { ExecArgs } from '@medusajs/framework/types';
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils';

// Image helpers
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop`;
const p = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

// Product data with variants and prices (in cents BRL)
const CATEGORIES = [
  {
    name: 'Tênis & Calçados',
    handle: 'tenis-calcados',
    description: 'Os melhores tênis para correr, treinar e arrasar no dia a dia.',
    rank: 1,
  },
  {
    name: 'Roupas & Moda',
    handle: 'roupas-moda',
    description: 'Looks para todos os estilos — do casual ao esportivo.',
    rank: 2,
  },
  {
    name: 'Acessórios',
    handle: 'acessorios',
    description: 'Relógios, óculos, bonés e tudo que completa o visual.',
    rank: 3,
  },
  {
    name: 'Eletrônicos',
    handle: 'eletronicos',
    description: 'Fones, gadgets e tecnologia para o seu dia a dia.',
    rank: 4,
  },
  {
    name: 'Esportes & Fitness',
    handle: 'esportes-fitness',
    description: 'Equipamentos e roupas para seus treinos e aventuras.',
    rank: 5,
  },
  {
    name: 'Mochilas & Bags',
    handle: 'mochilas-bags',
    description: 'Mochilas urbanas, esportivas e de viagem.',
    rank: 6,
  },
  {
    name: 'Casa & Lifestyle',
    handle: 'casa-lifestyle',
    description: 'Produtos para tornar sua casa e rotina mais incríveis.',
    rank: 7,
  },
  {
    name: 'Cursos Online',
    handle: 'cursos-online',
    description: 'Aprenda novas habilidades com especialistas do mercado.',
    rank: 8,
  },
];

const COLLECTIONS = [
  { title: 'NexRun', handle: 'nexrun' },
  { title: 'UrbanCo', handle: 'urbanco' },
  { title: 'ActivePro', handle: 'activepro' },
  { title: 'StyleBase', handle: 'stylebase' },
  { title: 'TechGear', handle: 'techgear' },
  { title: 'PrecisionTime', handle: 'precisiontime' },
];

const PRODUCTS = [
  {
    title: 'Tênis Running Pro X',
    handle: 'tenis-running-pro-x',
    description:
      'Tênis de alta performance para corridas de longa distância. Solado com amortecimento reativo, cabedal respirável em mesh e tecnologia de retorno de energia. Ideal para treinos diários e competições.',
    thumbnail: u('1542291026-7eec264c27ff'),
    images: [u('1542291026-7eec264c27ff'), p('1606107557195-0c61af2c7f07')],
    metadata: { brand_display: 'NexRun', badge: 'OFERTA' },
    collection: 'nexrun',
    categories: ['tenis-calcados', 'esportes-fitness'],
    options: [{ title: 'Tamanho', values: ['38', '39', '40', '41', '42', '43'] }],
    variants: [
      {
        title: '38',
        sku: 'TRPX-38',
        options: { Tamanho: '38' },
        price: 29990,
        compare_at_price: 45990,
      },
      {
        title: '39',
        sku: 'TRPX-39',
        options: { Tamanho: '39' },
        price: 29990,
        compare_at_price: 45990,
      },
      {
        title: '40',
        sku: 'TRPX-40',
        options: { Tamanho: '40' },
        price: 29990,
        compare_at_price: 45990,
      },
      {
        title: '41',
        sku: 'TRPX-41',
        options: { Tamanho: '41' },
        price: 29990,
        compare_at_price: 45990,
      },
      {
        title: '42',
        sku: 'TRPX-42',
        options: { Tamanho: '42' },
        price: 29990,
        compare_at_price: 45990,
      },
      {
        title: '43',
        sku: 'TRPX-43',
        options: { Tamanho: '43' },
        price: 29990,
        compare_at_price: 45990,
      },
    ],
  },
  {
    title: 'Camiseta Oversized Essential',
    handle: 'camiseta-oversized-essential',
    description:
      'Camiseta oversized em algodão 100% premium. Caimento relaxado, gola redonda e acabamento duplo-costura. Disponível em 5 cores neutras para combinar com qualquer look.',
    thumbnail: u('1521572163474-6864f9cf17ab'),
    images: [u('1521572163474-6864f9cf17ab')],
    metadata: { brand_display: 'UrbanCo', badge: 'NOVO' },
    collection: 'urbanco',
    categories: ['roupas-moda'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G', 'GG'] },
      { title: 'Cor', values: ['Branco', 'Preto', 'Cinza'] },
    ],
    variants: [
      {
        title: 'P — Branco',
        sku: 'COE-P-W',
        options: { Tamanho: 'P', Cor: 'Branco' },
        price: 7990,
        compare_at_price: null,
      },
      {
        title: 'M — Branco',
        sku: 'COE-M-W',
        options: { Tamanho: 'M', Cor: 'Branco' },
        price: 7990,
        compare_at_price: null,
      },
      {
        title: 'G — Branco',
        sku: 'COE-G-W',
        options: { Tamanho: 'G', Cor: 'Branco' },
        price: 7990,
        compare_at_price: null,
      },
      {
        title: 'P — Preto',
        sku: 'COE-P-B',
        options: { Tamanho: 'P', Cor: 'Preto' },
        price: 7990,
        compare_at_price: null,
      },
      {
        title: 'M — Preto',
        sku: 'COE-M-B',
        options: { Tamanho: 'M', Cor: 'Preto' },
        price: 7990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Relógio Minimalista Steel Pro',
    handle: 'relogio-minimalista-steel-pro',
    description:
      'Relógio analógico com caixa em aço inox 316L, vidro mineral anti-risco e pulseira intercambiável. Resistente à água até 50m. Design minimalista inspirado nos relógios suíços.',
    thumbnail: u('1523275335684-37898b6baf30'),
    images: [u('1523275335684-37898b6baf30')],
    metadata: { brand_display: 'PrecisionTime', badge: 'OFERTA' },
    collection: 'precisiontime',
    categories: ['acessorios'],
    options: [{ title: 'Cor', values: ['Prata', 'Preto', 'Dourado'] }],
    variants: [
      {
        title: 'Prata',
        sku: 'RMS-SV',
        options: { Cor: 'Prata' },
        price: 38900,
        compare_at_price: 54900,
      },
      {
        title: 'Preto',
        sku: 'RMS-BK',
        options: { Cor: 'Preto' },
        price: 38900,
        compare_at_price: 54900,
      },
      {
        title: 'Dourado',
        sku: 'RMS-GD',
        options: { Cor: 'Dourado' },
        price: 41900,
        compare_at_price: 58900,
      },
    ],
  },
  {
    title: 'Mochila Urban Cargo 30L',
    handle: 'mochila-urban-cargo-30l',
    description:
      'Mochila urbana com capacidade de 30 litros. Compartimento acolchoado para notebook até 15", bolso frontal organizer, passagem para fone de ouvido e sistema anti-furto traseiro.',
    thumbnail: u('1553062407-98eeb64c6a62'),
    images: [u('1553062407-98eeb64c6a62')],
    metadata: { brand_display: 'UrbanCo', badge: 'OFERTA' },
    collection: 'urbanco',
    categories: ['mochilas-bags'],
    options: [{ title: 'Cor', values: ['Preto', 'Cinza', 'Azul Marinho'] }],
    variants: [
      {
        title: 'Preto',
        sku: 'MUC-BK',
        options: { Cor: 'Preto' },
        price: 19990,
        compare_at_price: 27990,
      },
      {
        title: 'Cinza',
        sku: 'MUC-GY',
        options: { Cor: 'Cinza' },
        price: 19990,
        compare_at_price: 27990,
      },
      {
        title: 'Azul Marinho',
        sku: 'MUC-NV',
        options: { Cor: 'Azul Marinho' },
        price: 19990,
        compare_at_price: 27990,
      },
    ],
  },
  {
    title: 'Óculos de Sol Polarizado UV400',
    handle: 'oculos-sol-polarizado-uv400',
    description:
      'Óculos de sol com lentes polarizadas e proteção UV400. Armação em acetato leve e flexível. Proteção total contra raios UVA e UVB.',
    thumbnail: u('1572635196237-14b3f281503f'),
    images: [u('1572635196237-14b3f281503f')],
    metadata: { brand_display: 'UrbanCo', badge: null },
    collection: 'urbanco',
    categories: ['acessorios'],
    options: [{ title: 'Cor', values: ['Preto/Preto', 'Tartaruga/Verde', 'Dourado/Marrom'] }],
    variants: [
      {
        title: 'Preto/Preto',
        sku: 'OSP-BB',
        options: { Cor: 'Preto/Preto' },
        price: 15990,
        compare_at_price: null,
      },
      {
        title: 'Tartaruga/Verde',
        sku: 'OSP-TV',
        options: { Cor: 'Tartaruga/Verde' },
        price: 15990,
        compare_at_price: null,
      },
      {
        title: 'Dourado/Marrom',
        sku: 'OSP-GM',
        options: { Cor: 'Dourado/Marrom' },
        price: 17990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Fone Bluetooth ANC Pro 40h',
    handle: 'fone-bluetooth-anc-pro-40h',
    description:
      'Fone de ouvido over-ear com cancelamento ativo de ruído (ANC), 40h de bateria, conexão multipoint (2 dispositivos simultâneos) e drivers de 40mm para som premium.',
    thumbnail: u('1505740420928-5e560c06d30e'),
    images: [u('1505740420928-5e560c06d30e')],
    metadata: { brand_display: 'TechGear', badge: 'OFERTA' },
    collection: 'techgear',
    categories: ['eletronicos'],
    options: [{ title: 'Cor', values: ['Preto Matte', 'Branco Pérola', 'Azul Midnight'] }],
    variants: [
      {
        title: 'Preto Matte',
        sku: 'FBA-BK',
        options: { Cor: 'Preto Matte' },
        price: 49900,
        compare_at_price: 74900,
      },
      {
        title: 'Branco Pérola',
        sku: 'FBA-WH',
        options: { Cor: 'Branco Pérola' },
        price: 49900,
        compare_at_price: 74900,
      },
      {
        title: 'Azul Midnight',
        sku: 'FBA-BL',
        options: { Cor: 'Azul Midnight' },
        price: 49900,
        compare_at_price: 74900,
      },
    ],
  },
  {
    title: 'Shorts Running Dry-Fit 7"',
    handle: 'shorts-running-dry-fit',
    description:
      'Shorts de corrida com tecnologia Dry-Fit que elimina o suor rapidamente. Bolso traseiro com zíper, forro interno embutido e elástico ajustável.',
    thumbnail: u('1571902943202-507ec2618e8f'),
    images: [u('1571902943202-507ec2618e8f')],
    metadata: { brand_display: 'ActivePro', badge: 'NOVO' },
    collection: 'activepro',
    categories: ['roupas-moda', 'esportes-fitness'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G'] },
      { title: 'Cor', values: ['Preto', 'Azul'] },
    ],
    variants: [
      {
        title: 'P — Preto',
        sku: 'SRD-P-B',
        options: { Tamanho: 'P', Cor: 'Preto' },
        price: 8990,
        compare_at_price: null,
      },
      {
        title: 'M — Preto',
        sku: 'SRD-M-B',
        options: { Tamanho: 'M', Cor: 'Preto' },
        price: 8990,
        compare_at_price: null,
      },
      {
        title: 'G — Preto',
        sku: 'SRD-G-B',
        options: { Tamanho: 'G', Cor: 'Preto' },
        price: 8990,
        compare_at_price: null,
      },
      {
        title: 'M — Azul',
        sku: 'SRD-M-L',
        options: { Tamanho: 'M', Cor: 'Azul' },
        price: 8990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Tênis Casual Couro Premium',
    handle: 'tenis-casual-couro-premium',
    description:
      'Tênis casual em couro legítimo com palmilha memory foam e solado vulcanizado. Corte low-top clássico que combina com looks casuais e semi-formais.',
    thumbnail: p('1560769629-0751410301ad'),
    images: [p('1560769629-0751410301ad'), u('1542291026-7eec264c27ff')],
    metadata: { brand_display: 'StyleBase', badge: null },
    collection: 'stylebase',
    categories: ['tenis-calcados'],
    options: [
      { title: 'Tamanho', values: ['39', '40', '41', '42'] },
      { title: 'Cor', values: ['Branco', 'Preto'] },
    ],
    variants: [
      {
        title: '39 — Branco',
        sku: 'TCP-39W',
        options: { Tamanho: '39', Cor: 'Branco' },
        price: 24990,
        compare_at_price: null,
      },
      {
        title: '40 — Branco',
        sku: 'TCP-40W',
        options: { Tamanho: '40', Cor: 'Branco' },
        price: 24990,
        compare_at_price: null,
      },
      {
        title: '41 — Preto',
        sku: 'TCP-41B',
        options: { Tamanho: '41', Cor: 'Preto' },
        price: 24990,
        compare_at_price: null,
      },
      {
        title: '42 — Preto',
        sku: 'TCP-42B',
        options: { Tamanho: '42', Cor: 'Preto' },
        price: 24990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Jaqueta Corta-Vento Impermeável',
    handle: 'jaqueta-corta-vento-impermeavel',
    description:
      'Jaqueta corta-vento com tecnologia DWR, costura termocolada e capuz removível. Empacotável na própria bolsa interna. Ideal para trilhas e dias chuvosos.',
    thumbnail: p('1591047139829-d914cf7d6423'),
    images: [p('1591047139829-d914cf7d6423')],
    metadata: { brand_display: 'ActivePro', badge: 'OFERTA' },
    collection: 'activepro',
    categories: ['roupas-moda', 'esportes-fitness'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G'] },
      { title: 'Cor', values: ['Preto', 'Verde Musgo'] },
    ],
    variants: [
      {
        title: 'P — Preto',
        sku: 'JCI-P-B',
        options: { Tamanho: 'P', Cor: 'Preto' },
        price: 34990,
        compare_at_price: 49900,
      },
      {
        title: 'M — Preto',
        sku: 'JCI-M-B',
        options: { Tamanho: 'M', Cor: 'Preto' },
        price: 34990,
        compare_at_price: 49900,
      },
      {
        title: 'G — Verde Musgo',
        sku: 'JCI-G-G',
        options: { Tamanho: 'G', Cor: 'Verde Musgo' },
        price: 34990,
        compare_at_price: 49900,
      },
    ],
  },
  {
    title: 'Garrafa Térmica Inox 1 Litro',
    handle: 'garrafa-termica-inox-1l',
    description:
      'Garrafa térmica em aço inox dupla parede com vácuo. Mantém bebidas quentes por 12h e frias por 24h. Tampa com trava de segurança e alça de transporte.',
    thumbnail: p('1602143407296-f3c75e3d8ec7'),
    images: [p('1602143407296-f3c75e3d8ec7')],
    metadata: { brand_display: 'ActivePro', badge: 'OFERTA' },
    collection: 'activepro',
    categories: ['esportes-fitness', 'casa-lifestyle'],
    options: [{ title: 'Cor', values: ['Preto', 'Prata', 'Verde Oliva'] }],
    variants: [
      {
        title: 'Preto',
        sku: 'GTI-BK',
        options: { Cor: 'Preto' },
        price: 12990,
        compare_at_price: 17990,
      },
      {
        title: 'Prata',
        sku: 'GTI-SV',
        options: { Cor: 'Prata' },
        price: 12990,
        compare_at_price: 17990,
      },
      {
        title: 'Verde Oliva',
        sku: 'GTI-OL',
        options: { Cor: 'Verde Oliva' },
        price: 13990,
        compare_at_price: 17990,
      },
    ],
  },
  {
    title: 'Boné Snapback Premium 6 Panel',
    handle: 'bone-snapback-premium',
    description:
      'Boné snapback com aba plana e estrutura rígida. 6 painéis em algodão twill, fecho traseiro ajustável e bordado no frontal. Tamanho único.',
    thumbnail: u('1588850561407-ed78c282e89b'),
    images: [u('1588850561407-ed78c282e89b')],
    metadata: { brand_display: 'UrbanCo', badge: null },
    collection: 'urbanco',
    categories: ['acessorios', 'roupas-moda'],
    options: [{ title: 'Cor', values: ['Preto/Branco', 'Preto/Amarelo', 'Branco/Preto'] }],
    variants: [
      {
        title: 'Preto/Branco',
        sku: 'BSP-BW',
        options: { Cor: 'Preto/Branco' },
        price: 6990,
        compare_at_price: null,
      },
      {
        title: 'Preto/Amarelo',
        sku: 'BSP-BY',
        options: { Cor: 'Preto/Amarelo' },
        price: 6990,
        compare_at_price: null,
      },
      {
        title: 'Branco/Preto',
        sku: 'BSP-WB',
        options: { Cor: 'Branco/Preto' },
        price: 6990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Legging Compressão High Waist',
    handle: 'legging-compressao-high-waist',
    description:
      'Legging de compressão cintura alta com tecido squat-proof. Bolso lateral com zíper e cós largo embutido para maior suporte. Ideal para treino e yoga.',
    thumbnail: u('1595341888016-a392ef81b7de'),
    images: [u('1595341888016-a392ef81b7de')],
    metadata: { brand_display: 'ActivePro', badge: 'NOVO' },
    collection: 'activepro',
    categories: ['roupas-moda', 'esportes-fitness'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G'] },
      { title: 'Cor', values: ['Preto', 'Roxo'] },
    ],
    variants: [
      {
        title: 'P — Preto',
        sku: 'LCH-P-B',
        options: { Tamanho: 'P', Cor: 'Preto' },
        price: 11990,
        compare_at_price: null,
      },
      {
        title: 'M — Preto',
        sku: 'LCH-M-B',
        options: { Tamanho: 'M', Cor: 'Preto' },
        price: 11990,
        compare_at_price: null,
      },
      {
        title: 'G — Roxo',
        sku: 'LCH-G-P',
        options: { Tamanho: 'G', Cor: 'Roxo' },
        price: 11990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Polo Slim Fit Piquet',
    handle: 'polo-slim-fit-piquet',
    description:
      'Camisa polo slim fit em piquet 100% algodão penteado. Corte moderno, botões em madrepérola e bordado discreto no peito. Para ocasiões semi-formais e casuais.',
    thumbnail: p('1626497764746-6bb021e5b5a3'),
    images: [p('1626497764746-6bb021e5b5a3')],
    metadata: { brand_display: 'StyleBase', badge: null },
    collection: 'stylebase',
    categories: ['roupas-moda'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G'] },
      { title: 'Cor', values: ['Branco', 'Azul Marinho', 'Preto'] },
    ],
    variants: [
      {
        title: 'P — Branco',
        sku: 'PSF-P-W',
        options: { Tamanho: 'P', Cor: 'Branco' },
        price: 13990,
        compare_at_price: null,
      },
      {
        title: 'M — Azul Marinho',
        sku: 'PSF-M-N',
        options: { Tamanho: 'M', Cor: 'Azul Marinho' },
        price: 13990,
        compare_at_price: null,
      },
      {
        title: 'G — Preto',
        sku: 'PSF-G-B',
        options: { Tamanho: 'G', Cor: 'Preto' },
        price: 13990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Tênis High Top Street',
    handle: 'tenis-high-top-street',
    description:
      'Tênis cano alto em canvas com solado vulcanizado e forro em terry. Design inspirado no streetwear americano dos anos 80. Versátil para looks urbanos.',
    thumbnail: p('1606107557195-0c61af2c7f07'),
    images: [p('1606107557195-0c61af2c7f07')],
    metadata: { brand_display: 'NexRun', badge: 'OFERTA' },
    collection: 'nexrun',
    categories: ['tenis-calcados'],
    options: [
      { title: 'Tamanho', values: ['38', '40', '42'] },
      { title: 'Cor', values: ['Branco', 'Preto', 'Vermelho'] },
    ],
    variants: [
      {
        title: '38 — Branco',
        sku: 'THS-38W',
        options: { Tamanho: '38', Cor: 'Branco' },
        price: 31990,
        compare_at_price: 41990,
      },
      {
        title: '40 — Preto',
        sku: 'THS-40B',
        options: { Tamanho: '40', Cor: 'Preto' },
        price: 31990,
        compare_at_price: 41990,
      },
      {
        title: '42 — Vermelho',
        sku: 'THS-42R',
        options: { Tamanho: '42', Cor: 'Vermelho' },
        price: 31990,
        compare_at_price: 41990,
      },
    ],
  },
  {
    title: 'Carteira Slim Couro Vegano',
    handle: 'carteira-slim-couro-vegano',
    description:
      'Carteira slim em couro vegano com 6 slots para cartão, compartimento para notas e janela para CNH. Apenas 8mm de espessura.',
    thumbnail: p('1627123424253-58c3adcaffd2'),
    images: [p('1627123424253-58c3adcaffd2')],
    metadata: { brand_display: 'StyleBase', badge: null },
    collection: 'stylebase',
    categories: ['acessorios'],
    options: [{ title: 'Cor', values: ['Preto', 'Marrom', 'Cinza'] }],
    variants: [
      {
        title: 'Preto',
        sku: 'CSV-BK',
        options: { Cor: 'Preto' },
        price: 9990,
        compare_at_price: null,
      },
      {
        title: 'Marrom',
        sku: 'CSV-BR',
        options: { Cor: 'Marrom' },
        price: 9990,
        compare_at_price: null,
      },
      {
        title: 'Cinza',
        sku: 'CSV-GY',
        options: { Cor: 'Cinza' },
        price: 9990,
        compare_at_price: null,
      },
    ],
  },
  {
    title: 'Bermuda Cargo Streetwear',
    handle: 'bermuda-cargo-streetwear',
    description:
      'Bermuda cargo em sarja com 6 bolsos, caimento relaxado e elástico na cintura com cordão. Acabamento distressed e patch bordado. Estilo streetwear contemporâneo.',
    thumbnail: p('1473966968073-c7b699981df5'),
    images: [p('1473966968073-c7b699981df5')],
    metadata: { brand_display: 'UrbanCo', badge: null },
    collection: 'urbanco',
    categories: ['roupas-moda'],
    options: [
      { title: 'Tamanho', values: ['P', 'M', 'G'] },
      { title: 'Cor', values: ['Cáqui', 'Preto'] },
    ],
    variants: [
      {
        title: 'P — Cáqui',
        sku: 'BCS-P-K',
        options: { Tamanho: 'P', Cor: 'Cáqui' },
        price: 12990,
        compare_at_price: null,
      },
      {
        title: 'M — Preto',
        sku: 'BCS-M-B',
        options: { Tamanho: 'M', Cor: 'Preto' },
        price: 12990,
        compare_at_price: null,
      },
      {
        title: 'G — Cáqui',
        sku: 'BCS-G-K',
        options: { Tamanho: 'G', Cor: 'Cáqui' },
        price: 12990,
        compare_at_price: null,
      },
    ],
  },
];

export default async function seed({ container }: ExecArgs) {
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

  logger.info('🌱 Iniciando seed da Realizah...');

  // --- Guard: skip if products already exist ---
  const existingProducts = await productModule.listProducts({}, { take: 1 });
  if (existingProducts.length > 0) {
    logger.info('⚠️  Produtos já existem no banco. Para re-seed, limpe o banco primeiro.');
    return;
  }

  // 1. Região — use existing or create
  let region: { id: string; name: string };
  logger.info('  Criando região...');
  try {
    const existing = await regionModule.listRegions({ currency_code: 'brl' }, { take: 1 });
    if (existing.length > 0) {
      region = existing[0];
      logger.info(`  ✓ Região existente: ${region.name} (${region.id})`);
    } else {
      [region] = await regionModule.createRegions([
        { name: 'Brasil', currency_code: 'brl', countries: ['br'] },
      ]);
      logger.info(`  ✓ Região criada: ${region.name} (${region.id})`);
    }
  } catch {
    const existing = await regionModule.listRegions({}, { take: 1 });
    region = existing[0];
    logger.info(`  ✓ Usando região existente: ${region.name} (${region.id})`);
  }

  // 2. Sales Channel — use existing or create
  let salesChannel: { id: string; name: string };
  logger.info('  Criando sales channel...');
  const existingChannels = await salesChannelModule.listSalesChannels({ name: 'Realizah Store' });
  if (existingChannels.length > 0) {
    salesChannel = existingChannels[0];
    logger.info(`  ✓ Sales Channel existente: ${salesChannel.name} (${salesChannel.id})`);
  } else {
    [salesChannel] = await salesChannelModule.createSalesChannels([
      { name: 'Realizah Store', description: 'Canal de vendas principal da Realizah' },
    ]);
    logger.info(`  ✓ Sales Channel criado: ${salesChannel.name} (${salesChannel.id})`);
  }

  // Helper: get or create a category
  async function getOrCreateCategory(data: {
    name: string;
    handle: string;
    description: string;
    rank: number;
  }) {
    try {
      const existing = await productModule.listProductCategories(
        { handle: [data.handle] },
        { take: 1 },
      );
      if (existing.length > 0) return existing[0];
    } catch {
      /* fall through to create */
    }
    try {
      const [cat] = await productModule.createProductCategories([{ ...data, is_active: true }]);
      return cat;
    } catch {
      /* already exists race condition */
    }
    const existing = await productModule.listProductCategories(
      { handle: [data.handle] },
      { take: 1 },
    );
    return existing[0];
  }

  // Helper: get or create a collection
  async function getOrCreateCollection(data: { title: string; handle: string }) {
    try {
      const existing = await productModule.listProductCollections(
        { handle: [data.handle] },
        { take: 1 },
      );
      if (existing.length > 0) return existing[0];
    } catch {
      /* fall through to create */
    }
    try {
      const [col] = await productModule.createProductCollections([data]);
      return col;
    } catch {
      /* already exists */
    }
    const existing = await productModule.listProductCollections(
      { handle: [data.handle] },
      { take: 1 },
    );
    return existing[0];
  }

  // 3. Categorias
  logger.info('  Criando categorias...');
  const catMap: Record<string, string> = {};
  for (const catData of CATEGORIES) {
    const cat = await getOrCreateCategory(catData);
    if (cat) catMap[cat.handle] = cat.id;
  }
  logger.info(`  ✓ Categorias: ${Object.keys(catMap).length}`);

  // 4. Coleções (Brands)
  logger.info('  Criando coleções...');
  const colMap: Record<string, string> = {};
  for (const colData of COLLECTIONS) {
    const col = await getOrCreateCollection(colData);
    if (col) colMap[col.handle] = col.id;
  }
  logger.info(`  ✓ Coleções: ${Object.keys(colMap).length}`);

  // 5. Produtos
  logger.info('  Criando produtos...');
  const productLinks: { variantId: string; price: number; compareAtPrice: number | null }[] = [];

  for (const pd of PRODUCTS) {
    const { variants: variantData, collection, categories, ...productRest } = pd;

    const [product] = await productModule.createProducts([
      {
        ...productRest,
        // Convert image URL strings to { url } objects
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

    // Map variants by title for price creation
    for (const vd of variantData) {
      const actualVariant = product.variants?.find((v: { title: string }) => v.title === vd.title);
      if (actualVariant) {
        productLinks.push({
          variantId: actualVariant.id,
          price: vd.price,
          compareAtPrice: vd.compare_at_price,
        });
      }
    }

    // Link product to sales channel
    await remoteLink.create([
      {
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      },
    ]);

    logger.info(`    ✓ ${product.title}`);
  }

  // 6. Preços (price sets + links)
  logger.info(`  Criando preços para ${productLinks.length} variantes...`);
  for (const link of productLinks) {
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

  // 7. Publishable API Key — use existing or create
  logger.info('  Criando publishable API key...');
  let apiKey: { id: string; token: string; title: string };
  const existingKeys = await apiKeyModule.listApiKeys({ type: 'publishable' }, { take: 1 });
  if (existingKeys.length > 0) {
    apiKey = existingKeys[0];
    logger.info(`  ✓ API Key existente: ${apiKey.title} (${apiKey.token})`);
  } else {
    [apiKey] = await apiKeyModule.createApiKeys([
      { title: 'Realizah Storefront', type: 'publishable', created_by: 'seed' },
    ]);
  }

  // Link API key to sales channel
  try {
    await remoteLink.create([
      {
        [Modules.API_KEY]: { publishable_key_id: apiKey.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      },
    ]);
  } catch (e1) {
    try {
      await remoteLink.create([
        {
          [Modules.API_KEY]: { api_key_id: apiKey.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
        },
      ]);
    } catch {
      logger.warn(
        `  ⚠️  Não foi possível linkar API key ao sales channel. Link manual necessário.`,
      );
    }
  }

  logger.info('\n✅ Seed concluído com sucesso!');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info(`📦 Produtos criados: ${PRODUCTS.length}`);
  logger.info(`🏷️  Categorias: ${Object.keys(catMap).length}`);
  logger.info(`🏬 Coleções (brands): ${Object.keys(colMap).length}`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info(`🔑 NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('📌 Adicione a chave acima em apps/storefront/.env.local');
}
