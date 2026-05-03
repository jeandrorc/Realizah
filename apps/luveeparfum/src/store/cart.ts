import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCart, getCart, addToCart, removeFromCart } from '@/lib/api/cart';

interface CartState {
  cartId: string | null;
  itemCount: number;
  isOpen: boolean;
  setCartId: (id: string) => void;
  setItemCount: (count: number) => void;
  setIsOpen: (open: boolean) => void;
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      itemCount: 0,
      isOpen: false,
      setCartId: (id) => set({ cartId: id }),
      setItemCount: (count) => set({ itemCount: count }),
      setIsOpen: (open) => set({ isOpen: open }),
      initCart: async () => {
        const { cartId } = get();
        if (cartId) {
          try {
            const cart = await getCart(cartId);
            set({ itemCount: cart.items?.length ?? 0 });
            return;
          } catch {
            // Cart expired or not found, create new
          }
        }
        const cart = await createCart();
        set({ cartId: cart.id, itemCount: 0 });
      },
      addItem: async (variantId, quantity) => {
        const { cartId, initCart } = get();
        if (!cartId) await initCart();
        const currentCartId = get().cartId;
        if (!currentCartId) return;
        const cart = await addToCart(currentCartId, variantId, quantity);
        set({ itemCount: cart.items?.length ?? 0 });
      },
      removeItem: async (lineItemId) => {
        const { cartId } = get();
        if (!cartId) return;
        await removeFromCart(cartId, lineItemId);
        try {
          const cart = await getCart(cartId);
          set({ itemCount: cart.items?.length ?? 0 });
        } catch {
          set({ itemCount: 0 });
        }
      },
    }),
    {
      name: 'realizah-cart',
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);
