// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateCourseModuleInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');

  const { courseId } = req.query;

  const modules = await courseModuleService.listModules({ courseId });

  res.json({ modules });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');

  const data: CreateCourseModuleInput = req.body;

  const module = await courseModuleService.createModule(data);

  res.status(201).json({ module });
}
