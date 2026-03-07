'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { adaptCart } from '@/adapters/cart.adapter';
import { createCart, getCart, addToCart, updateCartItem, removeFromCart } from '@/lib/api/cart';
import { useCartStore } from '@/store/cart';

const CART_KEY = ['cart'];

export function useCart() {
  const cartId = useCartStore((s) => s.cartId);

  return useQuery({
    queryKey: [...CART_KEY, cartId],
    queryFn: async () => {
      if (!cartId) return null;
      const cart = await getCart(cartId);
      return adaptCart(cart);
    },
    staleTime: 0,
    enabled: !!cartId,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const setCartId = useCartStore((s) => s.setCartId);
  const setItemCount = useCartStore((s) => s.setItemCount);

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      let cartId = useCartStore.getState().cartId;
      if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id;
        setCartId(cartId);
      }
      const cart = await addToCart(cartId, variantId, quantity);
      setItemCount(cart.items?.length ?? 0);
      return cart;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      const cartId = useCartStore.getState().cartId;
      if (!cartId) throw new Error('No cart');
      const cart = await updateCartItem(cartId, lineItemId, quantity);
      useCartStore.getState().setItemCount(cart.items?.length ?? 0);
      return cart;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (lineItemId: string) => {
      const cartId = useCartStore.getState().cartId;
      if (!cartId) throw new Error('No cart');
      await removeFromCart(cartId, lineItemId);
      try {
        const cart = await getCart(cartId);
        useCartStore.getState().setItemCount(cart.items?.length ?? 0);
      } catch {
        useCartStore.getState().setItemCount(0);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}
