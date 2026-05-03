import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MEDUSA_URL } from '@/lib/config';

interface EnrollmentPageProps {
  params: Promise<{ enrollmentId: string }>;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  isPreview?: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  lessons?: Lesson[];
}

interface EnrollmentDetail {
  id: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    modules?: CourseModule[];
  };
  completedLessons?: string[];
}

async function getEnrollment(enrollmentId: string): Promise<EnrollmentDetail | null> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/my-enrollments/${enrollmentId}`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const { enrollment } = await res.json();
    return enrollment ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: EnrollmentPageProps): Promise<Metadata> {
  const { enrollmentId } = await params;
  const enrollment = await getEnrollment(enrollmentId);
  return { title: enrollment?.course.title ?? 'Meu Curso' };
}

export default async function EnrollmentPage({ params }: EnrollmentPageProps) {
  const { enrollmentId } = await params;
  const enrollment = await getEnrollment(enrollmentId);

  if (!enrollment) notFound();

  const completedSet = new Set(enrollment.completedLessons ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/my-courses">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Meus Cursos
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{enrollment.course.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 max-w-xs">
            <Progress value={enrollment.progress} className="h-2" />
          </div>
          <span className="text-sm text-muted-foreground">{enrollment.progress}% concluído</span>
          <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
            {enrollment.status === 'completed' ? 'Concluído' : 'Em andamento'}
          </Badge>
        </div>
      </div>

      <Separator />

      {enrollment.course.modules && enrollment.course.modules.length > 0 ? (
        <div className="space-y-4">
          {enrollment.course.modules.map((mod) => (
            <div key={mod.id} className="rounded-lg border overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 font-medium">{mod.title}</div>
              {mod.lessons && mod.lessons.length > 0 && (
                <ul className="divide-y">
                  {mod.lessons.map((lesson) => {
                    const isDone = completedSet.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/my-courses/${enrollmentId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-sm"
                        >
                          <span
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${
                              isDone
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {isDone ? '✓' : ''}
                          </span>
                          <span className={isDone ? 'line-through text-muted-foreground' : ''}>
                            {lesson.title}
                          </span>
                          <Badge variant="outline" className="ml-auto text-xs capitalize">
                            {lesson.type}
                          </Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum módulo disponível.</p>
      )}
    </div>
  );
}
