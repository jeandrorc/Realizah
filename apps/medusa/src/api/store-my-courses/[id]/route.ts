// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const enrollmentService = req.scope.resolve('enrollmentService');
  const progressManagerService = req.scope.resolve('progressManagerService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  if (enrollment.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const stats = await progressManagerService.getEnrollmentStats(id);

  res.json({ enrollment, stats });
}
