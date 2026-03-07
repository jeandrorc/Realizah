export interface CartItemProps {
  id: string;
  lineItemId: string;
  title: string;
  variantTitle?: string;
  imageUrl?: string;
  price: string;
  unitPrice: number;
  quantity: number;
  handle: string;
}

export interface CartSummaryProps {
  items: CartItemProps[];
  subtotal: string;
  subtotalAmount: number;
  discount?: string;
  discountAmount?: number;
  shipping?: string;
  shippingAmount?: number;
  total: string;
  totalAmount: number;
  itemCount: number;
}

function formatPrice(amount: number | undefined): string {
  if (!amount) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    amount / 100,
  );
}

export function adaptCartItem(raw: any): CartItemProps {
  return {
    id: raw.variant_id ?? raw.id,
    lineItemId: raw.id,
    title: raw.title ?? raw.variant?.product?.title ?? '',
    variantTitle: raw.variant?.title,
    imageUrl: raw.thumbnail ?? raw.variant?.product?.thumbnail,
    price: formatPrice(raw.unit_price * raw.quantity),
    unitPrice: raw.unit_price ?? 0,
    quantity: raw.quantity ?? 1,
    handle: raw.variant?.product?.handle ?? '',
  };
}

export function adaptCart(raw: any): CartSummaryProps {
  const items = (raw.items ?? []).map(adaptCartItem);
  return {
    items,
    subtotal: formatPrice(raw.subtotal),
    subtotalAmount: raw.subtotal ?? 0,
    discount: raw.discount_total ? formatPrice(raw.discount_total) : undefined,
    discountAmount: raw.discount_total,
    shipping: raw.shipping_total ? formatPrice(raw.shipping_total) : undefined,
    shippingAmount: raw.shipping_total,
    total: formatPrice(raw.total),
    totalAmount: raw.total ?? 0,
    itemCount: items.reduce((acc: number, i: CartItemProps) => acc + i.quantity, 0),
  };
}
