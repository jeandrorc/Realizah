import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CompleteLessonInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const lessonProgressService = req.scope.resolve('lessonProgressService');
  const progressManagerService = req.scope.resolve('progressManagerService');
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { id, lessonId } = req.params;
  const customerId = req.user?.customer_id;
  const data: CompleteLessonInput = req.body;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  if (enrollment.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const progress = await lessonProgressService.markAsCompleted(id, lessonId, data);

  const enrollmentProgress = await progressManagerService.calculateEnrollmentProgress(id);

  res.json({ progress, enrollmentProgress });
}
