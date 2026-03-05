import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import type { CreateReviewInput } from '@realizah/types';

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const courseReviewService = req.scope.resolve('courseReviewService');
  const courseService = req.scope.resolve('courseService');

  const customerId = req.user?.customer_id;
  const data: CreateReviewInput = req.body;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const review = await courseReviewService.createReview(customerId, data);

  await courseService.updateRating(data.courseId, data.rating);

  res.status(201).json({ review });
}
