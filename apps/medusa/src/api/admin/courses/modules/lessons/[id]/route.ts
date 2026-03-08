// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateLessonInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const lessonService = req.scope.resolve('lessonService');

  const { id } = req.params;

  const lesson = await lessonService.retrieveLesson(id);

  res.json({ lesson });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const lessonService = req.scope.resolve('lessonService');

  const { id } = req.params;
  const data: UpdateLessonInput = req.body;

  const lesson = await lessonService.updateLesson(id, data);

  res.json({ lesson });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const lessonService = req.scope.resolve('lessonService');

  const { id } = req.params;

  await lessonService.deleteLesson(id);

  res.status(204).send();
}
