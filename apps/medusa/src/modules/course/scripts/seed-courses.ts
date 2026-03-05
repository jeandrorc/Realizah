/**
 * Seed script for default courses
 * Run with: node --loader ts-node/esm src/modules/course/scripts/seed-courses.ts
 */

import type { CreateCourseInput } from '@realizah/types';

const defaultCourses: CreateCourseInput[] = [
  {
    title: 'Introdução ao Realizah',
    slug: 'introducao-realizah',
    description:
      'Aprenda os fundamentos da plataforma Realizah e como utilizá-la para alcançar seus objetivos.',
    thumbnail: '/images/courses/intro-realizah.jpg',
    instructorId: 'admin',
    category: 'Onboarding',
    level: 'beginner',
    duration: 60,
    language: 'pt-BR',
    requiredTier: 'free',
    metadata: {
      tags: ['onboarding', 'basics', 'introduction'],
    },
  },
  {
    title: 'Gestão de Projetos Ágeis',
    slug: 'gestao-projetos-ageis',
    description:
      'Domine metodologias ágeis como Scrum e Kanban para gerenciar projetos de forma eficiente.',
    thumbnail: '/images/courses/agile-pm.jpg',
    instructorId: 'admin',
    category: 'Gestão',
    level: 'intermediate',
    duration: 180,
    language: 'pt-BR',
    requiredTier: 'pro',
    metadata: {
      tags: ['agile', 'scrum', 'kanban', 'project-management'],
    },
  },
  {
    title: 'Desenvolvimento Full Stack Avançado',
    slug: 'fullstack-avancado',
    description:
      'Curso completo de desenvolvimento web com React, Node.js, TypeScript e boas práticas de arquitetura.',
    thumbnail: '/images/courses/fullstack.jpg',
    instructorId: 'admin',
    category: 'Tecnologia',
    level: 'advanced',
    duration: 480,
    language: 'pt-BR',
    requiredTier: 'premium',
    metadata: {
      tags: ['react', 'nodejs', 'typescript', 'fullstack', 'web-development'],
    },
  },
  {
    title: 'Marketing Digital para Iniciantes',
    slug: 'marketing-digital-iniciantes',
    description: 'Aprenda estratégias de marketing digital, SEO, redes sociais e campanhas pagas.',
    thumbnail: '/images/courses/digital-marketing.jpg',
    instructorId: 'admin',
    category: 'Marketing',
    level: 'beginner',
    duration: 120,
    language: 'pt-BR',
    requiredTier: 'free',
    metadata: {
      tags: ['marketing', 'seo', 'social-media', 'ads'],
    },
  },
  {
    title: 'Análise de Dados com Python',
    slug: 'analise-dados-python',
    description:
      'Domine análise de dados, visualização e machine learning com Python, Pandas e Scikit-learn.',
    thumbnail: '/images/courses/data-analysis.jpg',
    instructorId: 'admin',
    category: 'Tecnologia',
    level: 'intermediate',
    duration: 300,
    language: 'pt-BR',
    requiredTier: 'pro',
    metadata: {
      tags: ['python', 'data-science', 'pandas', 'machine-learning'],
    },
  },
];

async function seedCourses() {
  console.log('Starting course seeding...');

  // TODO: Implement actual seeding logic
  // This would require database connection and CourseService initialization

  console.log(`Prepared ${defaultCourses.length} courses for seeding:`);
  defaultCourses.forEach((course) => {
    console.log(`- ${course.title} (${course.level}, ${course.requiredTier})`);
  });

  console.log('\nTo seed these courses, integrate this script with Medusa CLI.');
}

seedCourses().catch(console.error);

export { defaultCourses };
