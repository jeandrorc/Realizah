// @ts-nocheck - MedusaService override conflicts
import { MedusaService } from '@medusajs/framework/utils';
import type { CreateLessonInput, UpdateLessonInput, Lesson as LessonType } from '@realizah/types';

class LessonService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Lesson: require('../models/lesson').default,
}) {
  async createLesson(data: CreateLessonInput): Promise<LessonType> {
    const lesson = await this.createLessons(data);
    return lesson as LessonType;
  }

  async listLessons(filters?: { moduleId?: string; isPreview?: boolean }): Promise<LessonType[]> {
    const lessons = await this.listLessons(filters);
    return lessons as LessonType[];
  }

  async retrieveLesson(lessonId: string): Promise<LessonType> {
    const lesson = await this.retrieveLesson(lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} not found`);
    }
    return lesson as LessonType;
  }

  async updateLesson(lessonId: string, data: UpdateLessonInput): Promise<LessonType> {
    const lesson = await this.updateLessons(lessonId, data);
    return lesson as LessonType;
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await this.deleteLessons(lessonId);
  }

  async getLessonsByModule(moduleId: string): Promise<LessonType[]> {
    const lessons = await this.listLessons({ moduleId });
    return lessons.sort((a, b) => a.order - b.order);
  }

  async getPreviewLessons(moduleId: string): Promise<LessonType[]> {
    const lessons = await this.listLessons({ moduleId, isPreview: true });
    return lessons.sort((a, b) => a.order - b.order);
  }

  async reorderLessons(moduleId: string, lessonIds: string[]): Promise<LessonType[]> {
    const updates: Promise<LessonType>[] = [];

    for (let i = 0; i < lessonIds.length; i++) {
      updates.push(this.updateLesson(lessonIds[i], { order: i + 1 }) as Promise<LessonType>);
    }

    return Promise.all(updates);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateLessonContent(type: string, content: any): boolean {
    switch (type) {
      case 'video':
        return !!(content.videoUrl && content.videoProvider);
      case 'text':
        return !!content.text;
      case 'quiz':
        return !!(content.questions && Array.isArray(content.questions));
      case 'file':
        return !!(content.fileUrl && content.fileName);
      case 'assignment':
        return !!content.text;
      default:
        return false;
    }
  }
}

export default LessonService;
