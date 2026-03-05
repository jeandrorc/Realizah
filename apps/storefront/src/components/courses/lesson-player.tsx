'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz' | 'file' | 'assignment';
    content?: Record<string, unknown> | null;
  };
  enrollmentId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export function LessonPlayer({ lesson, enrollmentId, isCompleted, onComplete }: LessonPlayerProps) {
  const [isMarking, setIsMarking] = useState(false);

  const handleComplete = async () => {
    setIsMarking(true);
    try {
      const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000';
      await fetch(
        `${MEDUSA_URL}/store/my-enrollments/${enrollmentId}/lessons/${lesson.id}/complete`,
        { method: 'POST', credentials: 'include' },
      );
      onComplete();
    } catch {
      // Ignore errors silently — UI will reflect change on refresh
    } finally {
      setIsMarking(false);
    }
  };

  const videoUrl =
    lesson.content && 'videoUrl' in lesson.content ? (lesson.content.videoUrl as string) : null;

  const textBody =
    lesson.content && 'body' in lesson.content ? (lesson.content.body as string) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{lesson.title}</h2>
        <Badge variant="outline" className="capitalize">
          {lesson.type}
        </Badge>
      </div>

      {lesson.type === 'video' && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              <p>Vídeo não disponível</p>
            </div>
          )}
        </div>
      )}

      {lesson.type === 'text' && textBody && (
        <div
          className="prose prose-sm max-w-none rounded-lg border p-6"
          dangerouslySetInnerHTML={{ __html: textBody }}
        />
      )}

      {lesson.type === 'file' && (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          <p>Arquivo para download disponível após matrícula.</p>
        </div>
      )}

      {lesson.type === 'quiz' && (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          <p>Quiz disponível em breve.</p>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        {isCompleted ? (
          <Button variant="outline" disabled>
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Aula Concluída
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={isMarking}>
            {isMarking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isMarking ? 'Marcando...' : 'Marcar como Concluída'}
          </Button>
        )}
      </div>
    </div>
  );
}
