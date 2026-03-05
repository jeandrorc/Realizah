import { model } from '@medusajs/framework/utils';

const Course = model.define('course', {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique().searchable(),
  description: model.text(),
  thumbnail: model.text().nullable(),
  instructorId: model.text().searchable(),
  category: model.text().searchable(),
  level: model.enum(['beginner', 'intermediate', 'advanced']),
  duration: model.number().default(0),
  language: model.text().default('pt-BR'),
  requiredTier: model.enum(['free', 'pro', 'premium']),
  featureId: model.text().nullable(),
  isPublished: model.boolean().default(false),
  publishedAt: model.dateTime().nullable(),
  enrollmentCount: model.number().default(0),
  rating: model.number().nullable(),
  ratingCount: model.number().default(0),
  metadata: model.json().nullable(),
});

export default Course;
