import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateCourseInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const { category, level, requiredTier, isPublished } = req.query;

  const courses = await courseService.listCourses({
    category,
    level,
    requiredTier,
    isPublished: isPublished === 'true' ? true : undefined,
  });

  res.json({ courses });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const courseService = req.scope.resolve('courseService');

  const data: CreateCourseInput = req.body;

  const course = await courseService.createCourse(data);

  res.status(201).json({ course });
}
