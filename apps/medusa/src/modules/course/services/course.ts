import { MedusaService } from '@medusajs/framework/utils';
import type { CreateCourseInput, UpdateCourseInput, Course as CourseType } from '@realizah/types';

class CourseService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Course: require('../models/course').default,
}) {
  async createCourse(data: CreateCourseInput): Promise<CourseType> {
    const course = await this.createCourses(data);
    return course as CourseType;
  }

  async listCourses(filters?: {
    category?: string;
    level?: string;
    requiredTier?: string;
    isPublished?: boolean;
  }): Promise<CourseType[]> {
    const courses = await this.listCourses(filters);
    return courses as CourseType[];
  }

  async retrieveCourse(courseId: string): Promise<CourseType> {
    const course = await this.retrieveCourse(courseId);
    if (!course) {
      throw new Error(`Course with id ${courseId} not found`);
    }
    return course as CourseType;
  }

  async getCourseBySlug(slug: string): Promise<CourseType | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses = await this.listCourses({ slug } as any);
    return courses[0] || null;
  }

  async updateCourse(courseId: string, data: UpdateCourseInput): Promise<CourseType> {
    const course = await this.updateCourses(courseId, data);
    return course as CourseType;
  }

  async deleteCourse(courseId: string): Promise<void> {
    await this.deleteCourses(courseId);
  }

  async publishCourse(courseId: string): Promise<CourseType> {
    const course = await this.updateCourses(courseId, {
      isPublished: true,
      publishedAt: new Date(),
    });
    return course as CourseType;
  }

  async unpublishCourse(courseId: string): Promise<CourseType> {
    const course = await this.updateCourses(courseId, {
      isPublished: false,
    });
    return course as CourseType;
  }

  async listPublishedCourses(): Promise<CourseType[]> {
    return this.listCourses({ isPublished: true });
  }

  async getCoursesByCategory(category: string): Promise<CourseType[]> {
    return this.listCourses({ category });
  }

  async incrementEnrollmentCount(courseId: string): Promise<void> {
    const course = await this.retrieveCourse(courseId);
    await this.updateCourses(courseId, {
      enrollmentCount: course.enrollmentCount + 1,
    });
  }

  async updateRating(courseId: string, newRating: number): Promise<CourseType> {
    const course = await this.retrieveCourse(courseId);

    const totalRating = (course.rating || 0) * course.ratingCount;
    const newRatingCount = course.ratingCount + 1;
    const newAvgRating = (totalRating + newRating) / newRatingCount;

    const updated = await this.updateCourses(courseId, {
      rating: Math.round(newAvgRating * 100) / 100,
      ratingCount: newRatingCount,
    });

    return updated as CourseType;
  }
}

export default CourseService;
