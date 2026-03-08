import { model } from '@medusajs/framework/utils';

const CourseReview = model.define('course_review', {
  id: model.id().primaryKey(),
  courseId: model.text(),
  customerId: model.text(),
  rating: model.number(),
  comment: model.text().nullable(),
  isPublished: model.boolean().default(true),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CourseReview as any).belongsTo(() => require('./course').default, {
  mappedBy: 'courseId',
});

export default CourseReview;
