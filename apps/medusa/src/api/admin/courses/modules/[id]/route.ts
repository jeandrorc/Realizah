import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { UpdateCourseModuleInput } from '@realizah/types';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');

  const { id } = req.params;

  const module = await courseModuleService.retrieveModule(id);

  res.json({ module });
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');

  const { id } = req.params;
  const data: UpdateCourseModuleInput = req.body;

  const module = await courseModuleService.updateModule(id, data);

  res.json({ module });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const courseModuleService = req.scope.resolve('courseModuleService');

  const { id } = req.params;

  await courseModuleService.deleteModule(id);

  res.status(204).send();
}
