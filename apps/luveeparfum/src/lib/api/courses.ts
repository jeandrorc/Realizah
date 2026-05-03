import { MEDUSA_URL } from '@/lib/config';

export async function listCourses(params?: { limit?: number; offset?: number }) {
  const limit = params?.limit ?? 12;
  const offset = params?.offset ?? 0;
  try {
    const response = await fetch(`${MEDUSA_URL}/store/courses?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return { courses: [], count: 0 };
    return response.json() as Promise<{ courses: unknown[]; count: number }>;
  } catch {
    return { courses: [], count: 0 };
  }
}

export async function getCourse(id: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/courses/${id}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const { course } = await response.json();
    return course ?? null;
  } catch {
    return null;
  }
}
