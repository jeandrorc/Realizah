import Medusa from '@medusajs/js-sdk';

const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '';

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000',
  debug: process.env.NODE_ENV === 'development',
  auth: {
    type: 'session',
  },
  globalHeaders: publishableKey ? { 'x-publishable-api-key': publishableKey } : {},
});
