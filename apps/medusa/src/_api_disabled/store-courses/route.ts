import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { category, level } = req.query;

  const courses = await courseService.listPublishedCourses();

  let filtered = courses;

  if (category) {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (level) {
    filtered = filtered.filter((c) => c.level === level);
  }

  res.json({ courses: filtered });
}
