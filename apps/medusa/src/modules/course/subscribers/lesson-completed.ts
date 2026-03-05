/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function lessonCompletedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Course] Lesson completed:', event.data);

  // TODO: Update progress
  // TODO: Unlock next lesson
  // TODO: Send progress notification
}

export const config: SubscriberConfig = {
  event: 'lesson.completed',
};
