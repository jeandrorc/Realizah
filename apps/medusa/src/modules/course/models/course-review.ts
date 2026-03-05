import { model } from '@medusajs/framework/utils';

const CourseReview = model.define('course_review', {
  id: model.id().primaryKey(),
  courseId: model.text().searchable(),
  customerId: model.text().searchable(),
  rating: model.number(),
  comment: model.text().nullable(),
  isPublished: model.boolean().default(true),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
CourseReview.belongsTo(() => require('./course').default, {
  mappedBy: 'courseId',
});

export default CourseReview;
