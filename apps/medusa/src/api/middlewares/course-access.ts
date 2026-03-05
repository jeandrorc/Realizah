import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';

/**
 * Middleware to verify customer access to courses based on tier and features
 */
export async function verifyCourseAccess(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const courseId = req.params.id || req.body.courseId;

  if (!courseId) {
    return next();
  }

  try {
    const courseService = req.scope.resolve('courseService');
    const accessControlService = req.scope.resolve('accessControlService');

    const course = await courseService.retrieveCourse(courseId);

    // Check tier-based access
    const hasAccess = await accessControlService.verifyAccess(customerId, course.requiredTier);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This course requires ${course.requiredTier} tier or higher`,
        requiredTier: course.requiredTier,
      });
    }

    // Check feature-based access (if course has a specific feature requirement)
    if (course.featureId) {
      const hasFeature = await accessControlService.verifyAccess(customerId, course.featureId);

      if (!hasFeature) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have access to this course feature',
          requiredFeature: course.featureId,
        });
      }
    }

    next();
  } catch (error) {
    console.error('[Course Access Middleware] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Helper function to check if customer can enroll in a course
 */
export async function canEnrollInCourse(
  customerId: string,
  courseId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  container: any,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const courseService = container.resolve('courseService');
    const accessControlService = container.resolve('accessControlService');
    const enrollmentService = container.resolve('enrollmentService');

    // Check if already enrolled
    const existingEnrollment = await enrollmentService.getEnrollment(customerId, courseId);

    if (existingEnrollment) {
      return {
        allowed: false,
        reason: 'Already enrolled in this course',
      };
    }

    // Check if course is published
    const course = await courseService.retrieveCourse(courseId);

    if (!course.isPublished) {
      return {
        allowed: false,
        reason: 'Course is not available',
      };
    }

    // Check tier access
    const hasAccess = await accessControlService.verifyAccess(customerId, course.requiredTier);

    if (!hasAccess) {
      return {
        allowed: false,
        reason: `Requires ${course.requiredTier} tier or higher`,
      };
    }

    // Check feature access (if applicable)
    if (course.featureId) {
      const hasFeature = await accessControlService.verifyAccess(customerId, course.featureId);

      if (!hasFeature) {
        return {
          allowed: false,
          reason: 'Missing required feature access',
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('[Course Access] Error checking enrollment eligibility:', error);
    return {
      allowed: false,
      reason: 'Error checking access',
    };
  }
}
