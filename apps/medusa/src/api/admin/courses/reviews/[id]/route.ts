import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const courseReviewService = req.scope.resolve('courseReviewService');

  const { id } = req.params;

  await courseReviewService.deleteReview(id);

  res.status(204).send();
}
