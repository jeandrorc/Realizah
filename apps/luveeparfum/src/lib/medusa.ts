import { createMedusaClient } from '@realizah/storefront-core';

export const medusa = createMedusaClient({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_API_URL ?? 'http://localhost:9000',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
  debug: process.env.NODE_ENV === 'development',
});
