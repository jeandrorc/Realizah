import { MedusaService } from '@medusajs/framework/utils';
import type {
  CreateCourseModuleInput,
  UpdateCourseModuleInput,
  CourseModule as CourseModuleType,
} from '@realizah/types';

class CourseModuleService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CourseModule: require('../models/course-module').default,
}) {
  async createModule(data: CreateCourseModuleInput): Promise<CourseModuleType> {
    const module = await this.createCourseModules(data);
    return module as CourseModuleType;
  }

  async listModules(filters?: { courseId?: string }): Promise<CourseModuleType[]> {
    const modules = await this.listCourseModules(filters);
    return modules as CourseModuleType[];
  }

  async retrieveModule(moduleId: string): Promise<CourseModuleType> {
    const module = await this.retrieveCourseModule(moduleId);
    if (!module) {
      throw new Error(`Course module with id ${moduleId} not found`);
    }
    return module as CourseModuleType;
  }

  async updateModule(moduleId: string, data: UpdateCourseModuleInput): Promise<CourseModuleType> {
    const module = await this.updateCourseModules(moduleId, data);
    return module as CourseModuleType;
  }

  async deleteModule(moduleId: string): Promise<void> {
    await this.deleteCourseModules(moduleId);
  }

  async getModulesByCourse(courseId: string): Promise<CourseModuleType[]> {
    const modules = await this.listModules({ courseId });
    return modules.sort((a, b) => a.order - b.order);
  }

  async reorderModules(courseId: string, moduleIds: string[]): Promise<CourseModuleType[]> {
    const updates: Promise<CourseModuleType>[] = [];

    for (let i = 0; i < moduleIds.length; i++) {
      updates.push(this.updateModule(moduleIds[i], { order: i + 1 }) as Promise<CourseModuleType>);
    }

    return Promise.all(updates);
  }

  async calculateTotalDuration(courseId: string): Promise<number> {
    const modules = await this.getModulesByCourse(courseId);
    return modules.reduce((total, module) => total + module.duration, 0);
  }
}

export default CourseModuleService;
