export type ProductBadge = string | null;

export interface ProductCardProps {
  id: string;
  title: string;
  handle: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  imageUrl?: string;
  brand?: string;
  badge: ProductBadge;
  variantId?: string;
}

export interface ProductDetailProps extends ProductCardProps {
  description?: string;
  images: string[];
  variants: ProductVariantOption[];
  attributes?: Record<string, string>;
}

export interface ProductVariantOption {
  id: string;
  title: string;
  sku?: string;
  price: string;
  originalPrice?: string;
  inStock: boolean;
  options: Record<string, string>;
}

function formatPrice(amount: number | undefined, currency = 'BRL'): string {
  if (!amount) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

/**
 * Resolve calculated price from Medusa v2 response.
 * Supports both:
 *   - v2 format: variant.calculated_price.calculated_amount
 *   - legacy format: variant.prices[0].calculated_amount
 */
function resolveVariantPrice(variant: Record<string, unknown>): {
  calculatedAmount: number | undefined;
  originalAmount: number | undefined;
} {
  // Medusa v2: calculated_price object
  const cp = variant.calculated_price as Record<string, unknown> | undefined;
  if (cp) {
    return {
      calculatedAmount: cp.calculated_amount as number | undefined,
      originalAmount: (cp.original_amount ?? cp.calculated_amount) as number | undefined,
    };
  }
  // Legacy / raw prices array
  const prices = variant.prices as Array<Record<string, unknown>> | undefined;
  const price = prices?.[0];
  return {
    calculatedAmount: (price?.calculated_amount ?? price?.amount) as number | undefined,
    originalAmount: price?.original_amount as number | undefined,
  };
}

function resolveBadge(raw: Record<string, unknown>): ProductBadge {
  const metadata = raw.metadata as Record<string, unknown> | undefined;
  // Explicit badge from metadata (set during seed)
  if (metadata?.badge === 'NOVO') return 'NOVO';
  if (metadata?.badge === 'OFERTA') return 'OFERTA';
  if (metadata?.is_new) return 'NOVO';
  // Auto-detect discount
  const variants = raw.variants as Array<Record<string, unknown>> | undefined;
  const variant = variants?.[0];
  if (!variant) return null;
  const { calculatedAmount, originalAmount } = resolveVariantPrice(variant);
  if (originalAmount && calculatedAmount && calculatedAmount < originalAmount) return 'OFERTA';
  return null;
}

export function adaptProduct(raw: Record<string, unknown>): ProductCardProps {
  const variants = raw.variants as Array<Record<string, unknown>> | undefined;
  const variant = variants?.[0];
  const { calculatedAmount, originalAmount } = variant
    ? resolveVariantPrice(variant)
    : { calculatedAmount: undefined, originalAmount: undefined };

  const discountPercent =
    originalAmount && calculatedAmount && calculatedAmount < originalAmount
      ? Math.round((1 - calculatedAmount / originalAmount) * 100)
      : undefined;

  const images = raw.images as Array<{ url: string }> | undefined;
  const collection = raw.collection as { title?: string } | undefined;
  const metadata = raw.metadata as Record<string, unknown> | undefined;

  return {
    id: raw.id as string,
    title: (raw.title as string) ?? '',
    handle: (raw.handle as string) ?? (raw.id as string),
    price: formatPrice(calculatedAmount),
    originalPrice:
      originalAmount && originalAmount !== calculatedAmount
        ? formatPrice(originalAmount)
        : undefined,
    discountPercent,
    imageUrl: (raw.thumbnail as string | undefined) ?? images?.[0]?.url,
    brand: (metadata?.brand_display as string | undefined) ?? collection?.title,
    badge: resolveBadge(raw),
    variantId: variant?.id as string | undefined,
  };
}

export function adaptProductDetail(raw: Record<string, unknown>): ProductDetailProps {
  const base = adaptProduct(raw);
  const images = raw.images as Array<{ url: string }> | undefined;
  const variants = raw.variants as Array<Record<string, unknown>> | undefined;
  const metadata = raw.metadata as Record<string, unknown> | undefined;

  return {
    ...base,
    description: raw.description as string | undefined,
    images: images?.map((img) => img.url) ?? (raw.thumbnail ? [raw.thumbnail as string] : []),
    variants: (variants ?? []).map((v) => {
      const vPrices = v.prices as Array<Record<string, unknown>> | undefined;
      const vOptions = v.options as Array<Record<string, unknown>> | undefined;
      return {
        id: v.id as string,
        title: v.title as string,
        sku: v.sku as string | undefined,
        price: formatPrice(
          (vPrices?.[0]?.calculated_amount ?? vPrices?.[0]?.amount) as number | undefined,
        ),
        originalPrice: vPrices?.[0]?.original_amount
          ? formatPrice(vPrices[0].original_amount as number)
          : undefined,
        inStock: ((v.inventory_quantity as number | undefined) ?? 1) > 0,
        options: Object.fromEntries(
          (vOptions ?? []).map((o) => {
            const opt = o.option as { title?: string } | undefined;
            return [opt?.title ?? (o.option_id as string), o.value as string];
          }),
        ),
      };
    }),
    attributes: metadata?.attributes as Record<string, string> | undefined,
  };
}
