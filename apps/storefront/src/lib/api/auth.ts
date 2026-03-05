import { HttpTypes } from '@medusajs/types';
import { medusa } from '../medusa';

export async function loginWithMedusa(
  email: string,
  password: string,
): Promise<string | { location: string }> {
  return medusa.auth.login('customer', 'emailpass', { email, password });
}

export async function registerWithMedusa(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<void> {
  await medusa.auth.register('customer', 'emailpass', {
    email: data.email,
    password: data.password,
  });
  await medusa.auth.login('customer', 'emailpass', {
    email: data.email,
    password: data.password,
  });
  await medusa.store.customer.create({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
  });
}

export async function logoutFromMedusa(): Promise<void> {
  await medusa.auth.logout();
}

export async function getCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  try {
    const { customer } = await medusa.store.customer.retrieve();
    return customer;
  } catch {
    return null;
  }
}
