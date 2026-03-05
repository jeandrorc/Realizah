/**
 * Tipos específicos do Medusa
 */

import type { BaseEntity } from './common';

export interface MedusaCustomer extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  hasAccount: boolean;
}

export interface MedusaProduct extends BaseEntity {
  title: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'rejected';
}
