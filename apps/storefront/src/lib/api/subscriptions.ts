import { MEDUSA_URL } from '@/lib/config';

export async function listSubscriptionPlans() {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/subscription-plans`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const { plans } = await response.json();
    return plans ?? [];
  } catch {
    return [];
  }
}

export async function getMySubscription() {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/my-subscription`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!response.ok) return null;
    const { subscription } = await response.json();
    return subscription ?? null;
  } catch {
    return null;
  }
}
