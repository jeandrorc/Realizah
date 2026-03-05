/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function quizPassedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Course] Quiz passed:', event.data);

  // TODO: Award badge/achievement
  // TODO: Send congratulations notification
}

export const config: SubscriberConfig = {
  event: 'quiz.passed',
};
