import { model } from '@medusajs/framework/utils';

const Lesson = model.define('lesson', {
  id: model.id().primaryKey(),
  moduleId: model.text().searchable(),
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
Lesson.belongsTo(() => require('./course-module').default, {
  mappedBy: 'moduleId',
});

export default Lesson;
