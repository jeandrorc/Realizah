// @ts-nocheck - updateCourseReviews signature
import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  CourseReview as CourseReviewType,
} from '@realizah/types';

class CourseReviewService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CourseReview: require('../models/course-review').default,
}) {
  async createReview(customerId: string, data: CreateReviewInput): Promise<CourseReviewType> {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if already reviewed
    const existing = await this.getReview(customerId, data.courseId);
    if (existing) {
      throw new Error('Customer has already reviewed this course');
    }

    const review = await this.createCourseReviews({
      customerId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment,
      isPublished: true,
    });

    return review as CourseReviewType;
  }

  async listReviews(filters?: {
    courseId?: string;
    customerId?: string;
    isPublished?: boolean;
  }): Promise<CourseReviewType[]> {
    const reviews = await this.listCourseReviews(filters);
    return reviews as CourseReviewType[];
  }

  async retrieveReview(reviewId: string): Promise<CourseReviewType> {
    const review = await this.retrieveCourseReview(reviewId);
    if (!review) {
      throw new Error(`Review with id ${reviewId} not found`);
    }
    return review as CourseReviewType;
  }

  async getReview(customerId: string, courseId: string): Promise<CourseReviewType | null> {
    const reviews = await this.listReviews({ customerId, courseId });
    return reviews[0] || null;
  }

  async updateReview(reviewId: string, data: UpdateReviewInput): Promise<CourseReviewType> {
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = await this.updateCourseReviews(reviewId, data);
    return review as CourseReviewType;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.deleteCourseReviews(reviewId);
  }

  async getCourseReviews(courseId: string): Promise<CourseReviewType[]> {
    return this.listReviews({ courseId, isPublished: true });
  }

  async calculateAverageRating(courseId: string): Promise<number> {
    const reviews = await this.getCourseReviews(courseId);
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 100) / 100;
  }
}

export default CourseReviewService;
