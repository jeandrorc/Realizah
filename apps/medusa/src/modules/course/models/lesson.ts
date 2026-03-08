import { model } from '@medusajs/framework/utils';

const Lesson = model.define('lesson', {
  id: model.id().primaryKey(),
  moduleId: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  type: model.enum(['video', 'text', 'quiz', 'assignment', 'file']),
  content: model.json(),
  order: model.number(),
  duration: model.number().default(0),
  isPreview: model.boolean().default(false),
  isPublished: model.boolean().default(false),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Lesson as any).belongsTo(() => require('./course-module').default, {
  mappedBy: 'moduleId',
});

export default Lesson;
