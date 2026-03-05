import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { SubmitQuizInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quizManagerService = req.scope.resolve('quizManagerService');
  const progressManagerService = req.scope.resolve('progressManagerService');
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { id, lessonId } = req.params;
  const customerId = req.user?.customer_id;
  const data: SubmitQuizInput = req.body;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  if (enrollment.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const result = await quizManagerService.submitQuiz(id, lessonId, data);

  if (result.passed) {
    await progressManagerService.calculateEnrollmentProgress(id);
  }

  res.json({ result });
}
