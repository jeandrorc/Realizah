// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const enrollmentService = req.scope.resolve('enrollmentService');
  const courseService = req.scope.resolve('courseService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.enroll(customerId, {
    courseId: id,
  });

  await courseService.incrementEnrollmentCount(id);

  res.status(201).json({ enrollment });
}
