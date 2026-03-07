import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateLessonInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const lessonService = req.scope.resolve('lessonService');

  const { moduleId } = req.query;

  const lessons = await lessonService.listLessons({ moduleId });

  res.json({ lessons });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const lessonService = req.scope.resolve('lessonService');

  const data: CreateLessonInput = req.body;

  const lesson = await lessonService.createLesson(data);

  res.status(201).json({ lesson });
}
