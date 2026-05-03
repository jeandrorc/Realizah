import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourse } from '@/lib/api/courses';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart } from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  lessons?: unknown[];
}

interface CourseDetail {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  level?: string | null;
  requiredTier?: string | null;
  enrollmentCount?: number | null;
  modules?: CourseModule[];
}

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return {};
  const c = course as CourseDetail;
  return {
    title: c.title,
    description: c.description?.slice(0, 160) ?? undefined,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const raw = await getCourse(id);

  if (!raw) notFound();

  const course = raw as CourseDetail;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {course.requiredTier && (
                <Badge variant="outline" className="capitalize">
                  {course.requiredTier}
                </Badge>
              )}
              {course.level && (
                <Badge variant="secondary" className="capitalize">
                  {course.level}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            )}
          </div>

          {course.modules && course.modules.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Conteúdo do Curso</h2>
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div key={module.id} className="rounded-lg border p-4">
                    <h3 className="font-medium">{module.title}</h3>
                    {module.lessons && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.lessons.length} aula{module.lessons.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border p-6 space-y-4">
            {course.thumbnail && (
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="space-y-2 text-sm text-muted-foreground">
              {course.enrollmentCount != null && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.enrollmentCount} alunos matriculados</span>
                </div>
              )}
              {course.level && (
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span className="capitalize">{course.level}</span>
                </div>
              )}
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/login">Matricular-se</Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Faça login para se matricular
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
