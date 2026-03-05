import { MedusaService } from '@medusajs/framework/utils';
import type { EnrollInput, Enrollment as EnrollmentType } from '@realizah/types';

class EnrollmentService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Enrollment: require('../models/enrollment').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Course: require('../models/course').default,
}) {
  async enroll(customerId: string, data: EnrollInput): Promise<EnrollmentType> {
    // Check if already enrolled
    const existing = await this.getEnrollment(customerId, data.courseId);
    if (existing) {
      throw new Error('Customer is already enrolled in this course');
    }

    // Verify course exists and is published
    const course = await this.retrieveCourse(data.courseId);
    if (!course) {
      throw new Error(`Course with id ${data.courseId} not found`);
    }
    if (!course.isPublished) {
      throw new Error('Course is not published');
    }

    const enrollment = await this.createEnrollments({
      customerId,
      courseId: data.courseId,
      status: 'active',
      enrolledAt: new Date(),
      progress: 0,
    });

    return enrollment as EnrollmentType;
  }

  async listEnrollments(filters?: {
    customerId?: string;
    courseId?: string;
    status?: string;
  }): Promise<EnrollmentType[]> {
    const enrollments = await this.listEnrollments(filters);
    return enrollments as EnrollmentType[];
  }

  async retrieveEnrollment(enrollmentId: string): Promise<EnrollmentType> {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }
    return enrollment as EnrollmentType;
  }

  async getEnrollment(customerId: string, courseId: string): Promise<EnrollmentType | null> {
    const enrollments = await this.listEnrollments({ customerId, courseId });
    return enrollments[0] || null;
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<EnrollmentType> {
    const enrollment = await this.updateEnrollments(enrollmentId, {
      progress,
      lastAccessedAt: new Date(),
    });
    return enrollment as EnrollmentType;
  }

  async completeEnrollment(enrollmentId: string): Promise<EnrollmentType> {
    const enrollment = await this.updateEnrollments(enrollmentId, {
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
    });
    return enrollment as EnrollmentType;
  }

  async dropEnrollment(enrollmentId: string): Promise<EnrollmentType> {
    const enrollment = await this.updateEnrollments(enrollmentId, {
      status: 'dropped',
    });
    return enrollment as EnrollmentType;
  }

  async getCustomerEnrollments(customerId: string): Promise<EnrollmentType[]> {
    return this.listEnrollments({ customerId });
  }

  async getCourseEnrollments(courseId: string): Promise<EnrollmentType[]> {
    return this.listEnrollments({ courseId });
  }

  async updateCertificateUrl(
    enrollmentId: string,
    certificateUrl: string,
  ): Promise<EnrollmentType> {
    const enrollment = await this.updateEnrollments(enrollmentId, {
      certificateUrl,
    });
    return enrollment as EnrollmentType;
  }
}

export default EnrollmentService;
