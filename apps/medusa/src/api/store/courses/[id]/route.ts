import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;

  const course = await courseService.retrieveCourse(id);

  if (!course.isPublished) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json({ course });
}
