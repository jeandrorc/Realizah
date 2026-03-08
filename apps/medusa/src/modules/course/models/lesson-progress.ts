import { model } from '@medusajs/framework/utils';

const LessonProgress = model.define('lesson_progress', {
  id: model.id().primaryKey(),
  enrollmentId: model.text(),
  lessonId: model.text(),
  status: model.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
  watchedDuration: model.number().nullable(),
  quizScore: model.number().nullable(),
  quizAttempts: model.number().default(0),
  completedAt: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(LessonProgress as any).belongsTo(() => require('./enrollment').default, {
  mappedBy: 'enrollmentId',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(LessonProgress as any).belongsTo(() => require('./lesson').default, {
  mappedBy: 'lessonId',
});

export default LessonProgress;
