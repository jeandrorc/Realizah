import { model } from '@medusajs/framework/utils';

const CourseModule = model.define('course_module', {
  id: model.id().primaryKey(),
  courseId: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  order: model.number(),
  duration: model.number().default(0),
  isPublished: model.boolean().default(false),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CourseModule as any).belongsTo(() => require('./course').default, {
  mappedBy: 'courseId',
});

export default CourseModule;
