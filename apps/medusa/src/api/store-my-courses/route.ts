// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const enrollmentService = req.scope.resolve('enrollmentService');
  const courseService = req.scope.resolve('courseService');

  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const enrollments = await enrollmentService.getCustomerEnrollments(customerId);

  const enrollmentsWithCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await courseService.retrieveCourse(enrollment.courseId);
      return {
        ...enrollment,
        course,
      };
    }),
  );

  res.json({ enrollments: enrollmentsWithCourses });
}
