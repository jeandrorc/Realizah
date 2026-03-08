// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');
  const lessonService = req.scope.resolve('lessonService');

  const { id } = req.params;

  const modules = await courseModuleService.getModulesByCourse(id);

  const modulesWithLessons = await Promise.all(
    modules.map(async (module) => {
      const lessons = await lessonService.getLessonsByModule(module.id);
      return {
        ...module,
        lessons: lessons.filter((l) => l.isPublished),
      };
    }),
  );

  res.json({ modules: modulesWithLessons });
}
