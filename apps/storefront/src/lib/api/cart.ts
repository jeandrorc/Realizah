import { HttpTypes } from '@medusajs/types';
import { medusa } from '../medusa';

export async function createCart(): Promise<HttpTypes.StoreCart> {
  const { cart } = await medusa.store.cart.create({});
  return cart;
}

export async function getCart(cartId: string): Promise<HttpTypes.StoreCart> {
  const { cart } = await medusa.store.cart.retrieve(cartId);
  return cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<HttpTypes.StoreCart> {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart;
}

export async function removeFromCart(
  cartId: string,
  lineItemId: string,
): Promise<HttpTypes.StoreLineItemDeleteResponse> {
  return medusa.store.cart.deleteLineItem(cartId, lineItemId);
}
