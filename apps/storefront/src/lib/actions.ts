'use server';

import { redirect } from 'next/navigation';
import { loginWithMedusa, registerWithMedusa, logoutFromMedusa } from './api';

export async function loginAction(
  email: string,
  password: string,
  redirectTo?: string,
): Promise<{ error?: string }> {
  try {
    await loginWithMedusa(email, password);
  } catch {
    return { error: 'Email ou senha incorretos. Tente novamente.' };
  }
  const target = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard';
  redirect(target);
}

export async function registerAction(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<{ error?: string }> {
  try {
    await registerWithMedusa(data);
  } catch {
    return { error: 'Não foi possível criar a conta. O email pode já estar em uso.' };
  }
  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  try {
    await logoutFromMedusa();
  } catch {
    // Ignore logout errors
  }
  redirect('/');
}
