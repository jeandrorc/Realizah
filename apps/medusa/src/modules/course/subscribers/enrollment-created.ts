/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function enrollmentCreatedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Course] Enrollment created:', event.data);

  // TODO: Send welcome email
  // TODO: Notify instructor
  // TODO: Update analytics
}

export const config: SubscriberConfig = {
  event: 'enrollment.created',
};
