import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';

/**
 * Middleware to verify customer access to digital products based on tier
 */
export async function verifyDigitalProductAccess(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const digitalProductId =
    req.params.id || req.body.digitalProductId || req.params.digitalProductId;

  if (!digitalProductId) {
    return next();
  }

  try {
    const digitalProductService = req.scope.resolve('digitalProductService');
    const accessControlService = req.scope.resolve('accessControlService');

    const product = await digitalProductService.retrieveProduct(digitalProductId);

    // Check tier-based access (if product has tier requirement)
    if (product.requiredTier) {
      const hasAccess = await accessControlService.verifyAccess(customerId, product.requiredTier);

      if (!hasAccess) {
        return res.status(403).json({
          error: 'Access denied',
          message: `This product requires ${product.requiredTier} tier or higher`,
          requiredTier: product.requiredTier,
        });
      }
    }

    next();
  } catch (error) {
    console.error('[Digital Product Access Middleware] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Helper function to check if customer can access a digital product
 */
export async function canAccessDigitalProduct(
  customerId: string,
  digitalProductId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const digitalProductService = container.resolve('digitalProductService');
    const accessControlService = container.resolve('accessControlService');

    const product = await digitalProductService.retrieveProduct(digitalProductId);

    // Check if product has tier requirement
    if (product.requiredTier) {
      const hasAccess = await accessControlService.verifyAccess(customerId, product.requiredTier);

      if (!hasAccess) {
        return {
          allowed: false,
          reason: `Requires ${product.requiredTier} tier or higher`,
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('[Digital Product Access] Error checking access:', error);
    return {
      allowed: false,
      reason: 'Error checking access',
    };
  }
}
