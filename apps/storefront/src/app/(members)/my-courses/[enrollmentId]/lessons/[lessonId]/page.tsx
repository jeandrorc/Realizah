import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/courses/lesson-player';

interface LessonPageProps {
  params: Promise<{ enrollmentId: string; lessonId: string }>;
}

interface LessonData {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'file' | 'assignment';
  content?: Record<string, unknown> | null;
}

async function getLesson(
  enrollmentId: string,
  lessonId: string,
): Promise<{ lesson: LessonData; isCompleted: boolean } | null> {
  try {
    const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000';
    const res = await fetch(`${MEDUSA_URL}/store/my-enrollments/${enrollmentId}/progress`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const { lessonProgresses, enrollment } = await res.json();

    const allLessons = enrollment?.course?.modules?.flatMap(
      (m: { lessons?: LessonData[] }) => m.lessons ?? [],
    ) as LessonData[] | undefined;

    const lesson = allLessons?.find((l) => l.id === lessonId) ?? null;
    if (!lesson) return null;

    const isCompleted = (lessonProgresses ?? []).some(
      (p: { lessonId: string; status: string }) =>
        p.lessonId === lessonId && p.status === 'completed',
    );

    return { lesson, isCompleted };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { enrollmentId, lessonId } = await params;
  const data = await getLesson(enrollmentId, lessonId);
  return { title: data?.lesson.title ?? 'Aula' };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { enrollmentId, lessonId } = await params;
  const data = await getLesson(enrollmentId, lessonId);

  if (!data) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/my-courses/${enrollmentId}`}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar ao Curso
        </Link>
      </Button>
      <LessonPlayer
        lesson={data.lesson}
        enrollmentId={enrollmentId}
        isCompleted={data.isCompleted}
        onComplete={() => {}}
      />
    </div>
  );
}
