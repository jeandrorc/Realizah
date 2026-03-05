import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const courseReviewService = req.scope.resolve('courseReviewService');

  const { courseId, customerId } = req.query;

  const reviews = await courseReviewService.listReviews({
    courseId,
    customerId,
  });

  res.json({ reviews });
}
