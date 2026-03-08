import { model } from '@medusajs/framework/utils';

const Enrollment = model.define('enrollment', {
  id: model.id().primaryKey(),
  customerId: model.text(),
  courseId: model.text(),
  status: model.enum(['active', 'completed', 'dropped']),
  enrolledAt: model.dateTime(),
  completedAt: model.dateTime().nullable(),
  progress: model.number().default(0),
  lastAccessedAt: model.dateTime().nullable(),
  certificateUrl: model.text().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Enrollment as any).belongsTo(() => require('./course').default, {
  mappedBy: 'courseId',
});

export default Enrollment;
