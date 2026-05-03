import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  level?: string | null;
  requiredTier?: string | null;
  enrollmentCount?: number | null;
}

interface CourseCardProps {
  course: Course;
}

const tierConfig: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-green-100 text-green-800 border-green-200' },
  pro: { label: 'Pro', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  premium: { label: 'Premium', className: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export function CourseCard({ course }: CourseCardProps) {
  const tier = course.requiredTier ? tierConfig[course.requiredTier] : null;

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <Link href={`/courses/${course.id}`}>
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={400}
              height={225}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {tier && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${tier.className}`}
            >
              {tier.label}
            </span>
          )}
          {course.level && (
            <Badge variant="outline" className="text-xs capitalize">
              {course.level}
            </Badge>
          )}
        </div>
        <Link href={`/courses/${course.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors leading-snug">
            {course.title}
          </h3>
        </Link>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
        )}
      </CardContent>
      {course.enrollmentCount != null && (
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>
              {course.enrollmentCount} aluno{course.enrollmentCount !== 1 ? 's' : ''}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
