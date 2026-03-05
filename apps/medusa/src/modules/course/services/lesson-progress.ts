import { MedusaService } from '@medusajs/framework/utils';
import type { CompleteLessonInput, LessonProgress as LessonProgressType } from '@realizah/types';

class LessonProgressService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LessonProgress: require('../models/lesson-progress').default,
}) {
  async getOrCreateProgress(enrollmentId: string, lessonId: string): Promise<LessonProgressType> {
    const existing = await this.getProgress(enrollmentId, lessonId);
    if (existing) {
      return existing;
    }

    const progress = await this.createLessonProgresses({
      enrollmentId,
      lessonId,
      status: 'not_started',
      quizAttempts: 0,
    });

    return progress as LessonProgressType;
  }

  async getProgress(enrollmentId: string, lessonId: string): Promise<LessonProgressType | null> {
    const progresses = await this.listLessonProgresses({
      enrollmentId,
      lessonId,
    });
    return progresses[0] || null;
  }

  async listProgress(filters?: {
    enrollmentId?: string;
    lessonId?: string;
    status?: string;
  }): Promise<LessonProgressType[]> {
    const progresses = await this.listLessonProgresses(filters);
    return progresses as LessonProgressType[];
  }

  async updateProgress(
    enrollmentId: string,
    lessonId: string,
    data: Partial<LessonProgressType>,
  ): Promise<LessonProgressType> {
    const progress = await this.getOrCreateProgress(enrollmentId, lessonId);

    const updated = await this.updateLessonProgresses(progress.id, data);
    return updated as LessonProgressType;
  }

  async markAsInProgress(
    enrollmentId: string,
    lessonId: string,
    data?: CompleteLessonInput,
  ): Promise<LessonProgressType> {
    return this.updateProgress(enrollmentId, lessonId, {
      status: 'in_progress',
      watchedDuration: data?.watchedDuration,
    });
  }

  async markAsCompleted(
    enrollmentId: string,
    lessonId: string,
    data?: CompleteLessonInput,
  ): Promise<LessonProgressType> {
    return this.updateProgress(enrollmentId, lessonId, {
      status: 'completed',
      completedAt: new Date(),
      watchedDuration: data?.watchedDuration,
    });
  }

  async updateQuizScore(
    enrollmentId: string,
    lessonId: string,
    score: number,
  ): Promise<LessonProgressType> {
    const progress = await this.getOrCreateProgress(enrollmentId, lessonId);

    const updated = await this.updateLessonProgresses(progress.id, {
      quizScore: score,
      quizAttempts: progress.quizAttempts + 1,
      status: score >= 70 ? 'completed' : 'in_progress',
      completedAt: score >= 70 ? new Date() : undefined,
    });

    return updated as LessonProgressType;
  }

  async getEnrollmentProgress(enrollmentId: string): Promise<LessonProgressType[]> {
    return this.listProgress({ enrollmentId });
  }

  async getCompletedLessonsCount(enrollmentId: string): Promise<number> {
    const progresses = await this.listProgress({
      enrollmentId,
      status: 'completed',
    });
    return progresses.length;
  }
}

export default LessonProgressService;
