import { Migration } from '@mikro-orm/migrations';

const SEED_ITEMS = JSON.stringify([
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
]);

export class Migration20260305100000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS storefront_menu (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL DEFAULT 'header_main',
        items JSONB NOT NULL DEFAULT '[]',
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_storefront_menu_name
        ON storefront_menu(name);
    `);

    this.addSql(`
      INSERT INTO storefront_menu (id, name, items)
      SELECT 'sfm_header_main', 'header_main', '${SEED_ITEMS}'::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM storefront_menu WHERE name = 'header_main');
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS storefront_menu CASCADE;');
  }
}
