import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MEDUSA_URL } from '@/lib/config';

export const metadata: Metadata = { title: 'Meus Cursos' };

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string | null;
  };
}

async function getMyEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/my-enrollments`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return [];
    const { enrollments } = await res.json();
    return (enrollments as Enrollment[]) ?? [];
  } catch {
    return [];
  }
}

export default async function MyCoursesPage() {
  const enrollments = await getMyEnrollments();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        <p className="text-muted-foreground mt-1">Continue de onde parou.</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 rounded-lg border border-dashed">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground mb-2">
            Você não está matriculado em nenhum curso.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Explore nosso catálogo e comece a aprender hoje.
          </p>
          <Button asChild>
            <Link href="/courses">Explorar Cursos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-2">
                    {enrollment.course.title}
                  </CardTitle>
                  <Badge
                    variant={enrollment.status === 'completed' ? 'default' : 'secondary'}
                    className="shrink-0 text-xs"
                  >
                    {enrollment.status === 'completed' ? 'Concluído' : 'Em andamento'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/my-courses/${enrollment.id}`}>
                    {enrollment.progress === 0 ? 'Começar' : 'Continuar'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
