// @ts-nocheck - updateEnrollments signature
import { MedusaService } from '@medusajs/framework/utils';

class CertificateManagerService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Enrollment: require('../models/enrollment').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Course: require('../models/course').default,
}) {
  async generateCertificate(enrollmentId: string): Promise<string> {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }

    if (enrollment.status !== 'completed') {
      throw new Error('Enrollment is not completed');
    }

    if (enrollment.certificateUrl) {
      return enrollment.certificateUrl;
    }

    const course = await this.retrieveCourse(enrollment.courseId);
    if (!course) {
      throw new Error(`Course with id ${enrollment.courseId} not found`);
    }

    // Generate certificate URL
    // In production, this would integrate with a PDF generation service
    // or a certificate generation API (e.g., Canvas API, PDFKit, etc.)
    const certificateId = `cert-${enrollmentId}-${Date.now()}`;
    const certificateUrl = `/certificates/${certificateId}.pdf`;

    // TODO: Integrate with actual certificate generation service
    // For now, we'll just store the URL placeholder

    // Update enrollment with certificate URL
    await this.updateEnrollments(enrollmentId, {
      certificateUrl,
    });

    return certificateUrl;
  }

  async getCertificate(enrollmentId: string): Promise<string | null> {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }

    return enrollment.certificateUrl || null;
  }

  async verifyCertificate(certificateUrl: string): Promise<boolean> {
    // In production, this would verify the certificate against a database
    // or a blockchain-based verification system
    const enrollments = await this.listEnrollments({
      certificateUrl,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return enrollments.length > 0;
  }

  async getCertificateMetadata(enrollmentId: string) {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }

    const course = await this.retrieveCourse(enrollment.courseId);
    if (!course) {
      throw new Error(`Course with id ${enrollment.courseId} not found`);
    }

    return {
      enrollmentId,
      courseId: course.id,
      courseTitle: course.title,
      customerId: enrollment.customerId,
      completedAt: enrollment.completedAt,
      certificateUrl: enrollment.certificateUrl,
      duration: course.duration,
      level: course.level,
    };
  }

  async listCustomerCertificates(customerId: string) {
    const enrollments = await this.listEnrollments({
      customerId,
      status: 'completed',
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const certificates = [];

    for (const enrollment of enrollments) {
      if (enrollment.certificateUrl) {
        const course = await this.retrieveCourse(enrollment.courseId);
        certificates.push({
          enrollmentId: enrollment.id,
          courseId: course.id,
          courseTitle: course.title,
          completedAt: enrollment.completedAt,
          certificateUrl: enrollment.certificateUrl,
        });
      }
    }

    return certificates;
  }
}

export default CertificateManagerService;
