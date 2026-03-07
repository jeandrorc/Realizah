'use client';

import { useQuery } from '@tanstack/react-query';

interface InventoryData {
  quantity: number;
  in_stock: boolean;
}

export function useStock(variantId: string | undefined) {
  return useQuery<InventoryData | null>({
    queryKey: ['stock', variantId],
    queryFn: async () => {
      if (!variantId) return null;
      const res = await fetch(`/api/variants/${variantId}/inventory`);
      if (!res.ok) return null;
      return res.json() as Promise<InventoryData>;
    },
    enabled: !!variantId,
    staleTime: 1000 * 30,
  });
}
