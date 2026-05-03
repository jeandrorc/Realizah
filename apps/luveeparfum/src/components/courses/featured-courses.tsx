import Link from 'next/link';
import Image from 'next/image';
import { listCourses } from '@/lib/api/courses';

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

export async function FeaturedCourses() {
  const { courses } = await listCourses({ limit: 3 });

  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Cursos em Destaque</h2>
          <Link href="/courses" className="text-sm text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(courses as Course[]).map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group block rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl overflow-hidden">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '📚'
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {course.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
