// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateCourseInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;

  const course = await courseService.retrieveCourse(id);

  res.json({ course });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;
  const data: UpdateCourseInput = req.body;

  const course = await courseService.updateCourse(id, data);

  res.json({ course });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;

  await courseService.deleteCourse(id);

  res.status(204).send();
}
