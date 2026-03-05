/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';

export default async function reviewCreatedHandler({ event }: SubscriberArgs<any>) {
  console.log('[Course] Review created:', event.data);

  // TODO: Update course rating
  // TODO: Notify instructor
  // TODO: Moderate review (if needed)
}

export const config: SubscriberConfig = {
  event: 'review.created',
};
