/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function enrollmentCompletedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Course] Enrollment completed:', event.data);

  // TODO: Generate certificate
  // TODO: Send congratulations email
  // TODO: Unlock next course recommendations
  // TODO: Update customer tier (if applicable)
}

export const config: SubscriberConfig = {
  event: 'enrollment.completed',
};
