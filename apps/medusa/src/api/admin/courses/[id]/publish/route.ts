// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;

  const course = await courseService.publishCourse(id);

  res.json({ course });
}
