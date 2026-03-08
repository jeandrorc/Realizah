// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { id } = req.params;

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  res.json({ enrollment });
}
