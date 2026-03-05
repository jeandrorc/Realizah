/**
 * Seed script for default digital products
 * Run with: node --loader ts-node/esm src/modules/digital-delivery/scripts/seed-products.ts
 */

import type { CreateDigitalProductInput } from '@realizah/types';

const defaultProducts: CreateDigitalProductInput[] = [
  {
    productId: 'prod_ebook_typescript',
    name: 'Guia Completo de TypeScript',
    description:
      'Ebook completo sobre TypeScript, desde o básico até conceitos avançados. Inclui exemplos práticos e exercícios.',
    type: 'ebook',
    downloadLimit: 5,
    expirationDays: 365,
    requiredTier: 'free',
    metadata: {
      pages: 250,
      format: 'PDF',
      language: 'pt-BR',
      author: 'Realizah Team',
    },
  },
  {
    productId: 'prod_template_landing',
    name: 'Template de Landing Page Premium',
    description:
      'Template profissional de landing page com React e Tailwind CSS. Totalmente responsivo e otimizado para conversão.',
    type: 'template',
    downloadLimit: 3,
    requiredTier: 'pro',
    metadata: {
      framework: 'React',
      styling: 'Tailwind CSS',
      includes: ['Source code', 'Documentation', 'Figma design'],
    },
  },
  {
    productId: 'prod_software_cli',
    name: 'Realizah CLI Tool',
    description:
      'Ferramenta de linha de comando para automação de tarefas comuns na plataforma Realizah.',
    type: 'software',
    requiredTier: 'premium',
    metadata: {
      platforms: ['macOS', 'Linux', 'Windows'],
      version: '1.0.0',
      license: 'MIT',
    },
  },
  {
    productId: 'prod_audio_meditation',
    name: 'Áudio de Meditação Guiada',
    description:
      'Coleção de 10 áudios de meditação guiada para redução de estresse e aumento de foco.',
    type: 'audio',
    downloadLimit: 10,
    expirationDays: 180,
    requiredTier: 'free',
    metadata: {
      duration: '60 minutes',
      format: 'MP3',
      quality: '320kbps',
      tracks: 10,
    },
  },
  {
    productId: 'prod_document_checklist',
    name: 'Checklist de Lançamento de Produto',
    description:
      'Checklist completo para lançamento de produtos digitais, com templates e exemplos.',
    type: 'document',
    downloadLimit: 5,
    requiredTier: 'pro',
    metadata: {
      format: 'PDF + DOCX',
      pages: 15,
      includes: ['Checklist', 'Templates', 'Examples'],
    },
  },
];

async function seedProducts() {
  console.log('Starting digital products seeding...');

  // TODO: Implement actual seeding logic
  // This would require database connection and DigitalProductService initialization

  console.log(`Prepared ${defaultProducts.length} products for seeding:`);
  defaultProducts.forEach((product) => {
    console.log(`- ${product.name} (${product.type}, ${product.requiredTier || 'no tier'})`);
  });

  console.log('\nTo seed these products, integrate this script with Medusa CLI.');
}

seedProducts().catch(console.error);

export { defaultProducts };
