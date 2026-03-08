// @ts-nocheck - MedusaService
import { MedusaService } from '@medusajs/framework/utils';

class ProgressManagerService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Enrollment: require('../models/enrollment').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LessonProgress: require('../models/lesson-progress').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Lesson: require('../models/lesson').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CourseModule: require('../models/course-module').default,
}) {
  async calculateEnrollmentProgress(enrollmentId: string): Promise<number> {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }

    // Get all modules for the course
    const modules = await this.listCourseModules({
      courseId: enrollment.courseId,
    });

    // Get all lessons for these modules
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLessons: any[] = [];
    for (const module of modules) {
      const lessons = await this.listLessons({ moduleId: module.id });
      allLessons.push(...lessons);
    }

    if (allLessons.length === 0) {
      return 0;
    }

    // Get completed lessons
    const progresses = await this.listLessonProgresses({
      enrollmentId,
      status: 'completed',
    });

    const completedCount = progresses.length;
    const totalCount = allLessons.length;

    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    // Update enrollment progress
    await this.updateEnrollments(enrollmentId, {
      progress: progressPercentage,
      lastAccessedAt: new Date(),
    });

    // Auto-complete enrollment if 100%
    if (progressPercentage === 100) {
      await this.updateEnrollments(enrollmentId, {
        status: 'completed',
        completedAt: new Date(),
      });
    }

    return progressPercentage;
  }

  async getEnrollmentStats(enrollmentId: string) {
    const enrollment = await this.retrieveEnrollment(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${enrollmentId} not found`);
    }

    // Get all modules for the course
    const modules = await this.listCourseModules({
      courseId: enrollment.courseId,
    });

    // Get all lessons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLessons: any[] = [];
    for (const module of modules) {
      const lessons = await this.listLessons({ moduleId: module.id });
      allLessons.push(...lessons);
    }

    // Get all progresses
    const progresses = await this.listLessonProgresses({ enrollmentId });

    const completed = progresses.filter((p) => p.status === 'completed').length;
    const inProgress = progresses.filter((p) => p.status === 'in_progress').length;
    const notStarted = allLessons.length - completed - inProgress;

    const totalWatchedMinutes = progresses.reduce((sum, p) => sum + (p.watchedDuration || 0), 0);

    return {
      totalLessons: allLessons.length,
      completedLessons: completed,
      inProgressLessons: inProgress,
      notStartedLessons: notStarted,
      progressPercentage: enrollment.progress,
      totalWatchedMinutes,
      lastAccessedAt: enrollment.lastAccessedAt,
    };
  }

  async getModuleProgress(enrollmentId: string, moduleId: string) {
    const lessons = await this.listLessons({ moduleId });

    if (lessons.length === 0) {
      return {
        moduleId,
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
      };
    }

    const progresses = await this.listLessonProgresses({ enrollmentId });
    const moduleLessonIds = lessons.map((l) => l.id);

    const moduleProgresses = progresses.filter((p) => moduleLessonIds.includes(p.lessonId));

    const completed = moduleProgresses.filter((p) => p.status === 'completed').length;

    return {
      moduleId,
      totalLessons: lessons.length,
      completedLessons: completed,
      progressPercentage: Math.round((completed / lessons.length) * 100),
    };
  }

  async getCourseProgressOverview(courseId: string) {
    const enrollments = await this.listEnrollments({ courseId });

    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter((e) => e.status === 'active').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;

    const avgProgress =
      totalEnrollments > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments)
        : 0;

    return {
      courseId,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageProgress: avgProgress,
      completionRate:
        totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
    };
  }
}

export default ProgressManagerService;
