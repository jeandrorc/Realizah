// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const certificateManagerService = req.scope.resolve('certificateManagerService');
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  if (enrollment.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const certificateUrl = await certificateManagerService.getCertificate(id);

  if (!certificateUrl) {
    return res.status(404).json({ error: 'Certificate not available' });
  }

  res.json({ certificateUrl });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const certificateManagerService = req.scope.resolve('certificateManagerService');
  const enrollmentService = req.scope.resolve('enrollmentService');

  const { id } = req.params;
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollment = await enrollmentService.retrieveEnrollment(id);

  if (enrollment.customerId !== customerId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const certificateUrl = await certificateManagerService.generateCertificate(id);

  res.status(201).json({ certificateUrl });
}
