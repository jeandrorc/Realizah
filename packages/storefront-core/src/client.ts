import Medusa from '@medusajs/js-sdk';

export interface MedusaClientConfig {
  baseUrl: string;
  publishableKey: string;
  debug?: boolean;
}

/**
 * Factory — create a Medusa client scoped to a specific store's publishable key.
 * Each storefront (luveeparfum, choseneyewer, etc.) calls this once with its own env vars.
 */
export function createMedusaClient(config: MedusaClientConfig): Medusa {
  return new Medusa({
    baseUrl: config.baseUrl,
    debug: config.debug ?? false,
    auth: {
      type: 'session',
    },
    globalHeaders: config.publishableKey ? { 'x-publishable-api-key': config.publishableKey } : {},
  });
}
