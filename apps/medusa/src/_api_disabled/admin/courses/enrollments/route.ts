import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { customerId, courseId, status } = req.query;

  const enrollments = await enrollmentService.listEnrollments({
    customerId,
    courseId,
    status,
  });

  res.json({ enrollments });
}
