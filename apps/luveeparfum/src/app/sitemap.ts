import type { MetadataRoute } from 'next';
import { listProducts } from '@/lib/api/products';
import { listCourses } from '@/lib/api/courses';
import { BASE_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsResult, coursesResult] = await Promise.allSettled([
    listProducts({ limit: 100 }),
    listCourses({ limit: 100 }),
  ]);

  const products = productsResult.status === 'fulfilled' ? productsResult.value.products : [];
  const courses = coursesResult.status === 'fulfilled' ? coursesResult.value.courses : [];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/subscription`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.handle}`,
    lastModified: new Date(product.updated_at ?? new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const courseRoutes: MetadataRoute.Sitemap = ((courses as Array<{ id: string }>) ?? []).map(
    (course) => ({
      url: `${BASE_URL}/courses/${course.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...productRoutes, ...courseRoutes];
}
