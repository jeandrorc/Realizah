import type { Metadata } from 'next';
import { listCourses } from '@/lib/api/courses';
import { CourseCard } from '@/components/courses/course-card';

export const metadata: Metadata = { title: 'Cursos' };

interface CourseData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  level?: string | null;
  requiredTier?: string | null;
  enrollmentCount?: number | null;
}

export default async function CoursesPage() {
  const { courses, count } = await listCourses({ limit: 12 });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cursos</h1>
        <p className="text-muted-foreground mt-2">
          {count} curso{count !== 1 ? 's' : ''} disponível{count !== 1 ? 'is' : ''}
        </p>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Nenhum curso disponível no momento.</p>
          <p className="text-sm text-muted-foreground mt-2">Em breve novos conteúdos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(courses as CourseData[]).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
