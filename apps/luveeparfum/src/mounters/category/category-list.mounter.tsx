import Link from 'next/link';
import { listCategories } from '@/lib/api/categories';
import { MOCK_CATEGORIES } from '@/lib/mock/categories';

const CATEGORY_EMOJIS: Record<string, string> = {
  'tenis-calcados': '👟',
  'roupas-moda': '👕',
  acessorios: '⌚',
  eletronicos: '🎧',
  'esportes-fitness': '💪',
  'mochilas-bags': '🎒',
  'casa-lifestyle': '🏠',
  'cursos-online': '📚',
};

export async function CategoryListMounter() {
  const medusaCategories = await listCategories({ limit: 12 });

  const categories =
    medusaCategories.length > 0
      ? medusaCategories.map((c) => ({
          id: c.id,
          slug: c.handle,
          title: c.name,
          iconEmoji: CATEGORY_EMOJIS[c.handle] ?? '🛍️',
        }))
      : MOCK_CATEGORIES.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          iconEmoji: c.iconEmoji,
        }));

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-surface hover:bg-zinc-200 rounded-lg px-5 py-3 transition-colors"
        >
          <span className="text-2xl">{cat.iconEmoji}</span>
          <span className="text-xs font-medium text-ink whitespace-nowrap">{cat.title}</span>
        </Link>
      ))}
    </div>
  );
}
