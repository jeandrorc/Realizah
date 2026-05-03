'use client';

import { useState } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import type { ProductDetailProps } from '@/adapters/product.adapter';

interface ProductInfoProps extends ProductDetailProps {
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export function ProductInfo({
  title,
  price,
  originalPrice,
  discountPercent,
  variants,
  brand,
  badge,
  onAddToCart,
}: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);

  const currentVariant = variants.find((v) => v.id === selectedVariant) ?? variants[0];
  const optionKeys = currentVariant ? Object.keys(currentVariant.options) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Brand + badge */}
      <div className="flex items-center gap-2">
        {brand && (
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            {brand}
          </span>
        )}
        {badge && (
          <span className="bg-fire text-white text-xs font-bold px-2 py-0.5 rounded-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-[32px] md:text-[40px] text-ink leading-tight">{title}</h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-ink">{currentVariant?.price ?? price}</span>
        {(currentVariant?.originalPrice ?? originalPrice) && (
          <span className="text-base text-zinc-400 line-through">
            {currentVariant?.originalPrice ?? originalPrice}
          </span>
        )}
        {discountPercent && (
          <span className="bg-fire text-white text-xs font-bold px-2 py-0.5 rounded-sm">
            -{discountPercent}%
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500">em até 12x sem juros</p>

      {/* Variant selectors */}
      {optionKeys.map((key) => {
        const values = [...new Set(variants.map((v) => v.options[key]).filter(Boolean))];
        return (
          <div key={key}>
            <p className="text-sm font-semibold text-ink mb-2">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const variantWithValue = variants.find((v) => v.options[key] === value);
                const isSelected = variantWithValue?.id === selectedVariant;
                return (
                  <button
                    key={value}
                    onClick={() => variantWithValue && setSelectedVariant(variantWithValue.id)}
                    className={`px-3 py-1.5 text-sm border rounded-sm transition-colors ${
                      isSelected
                        ? 'border-ink bg-ink text-paper'
                        : 'border-zinc-200 text-ink hover:border-ink'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity */}
      <div>
        <p className="text-sm font-semibold text-ink mb-2">Quantidade</p>
        <div className="flex items-center gap-3 w-fit border border-zinc-200 rounded-sm">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="px-3 py-2 text-ink hover:bg-surface transition-colors font-bold"
          >
            −
          </button>
          <span className="text-ink font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar quantidade"
            className="px-3 py-2 text-ink hover:bg-surface transition-colors font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => onAddToCart?.(selectedVariant, quantity)}
          className="flex items-center justify-center gap-2 w-full bg-ink text-paper font-semibold py-4 rounded-md hover:bg-fire transition-colors duration-200"
        >
          <Zap className="w-4 h-4" />
          Comprar agora
        </button>
        <button
          onClick={() => onAddToCart?.(selectedVariant, quantity)}
          className="flex items-center justify-center gap-2 w-full border-2 border-ink text-ink font-semibold py-3.5 rounded-md hover:bg-ink hover:text-paper transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao carrinho
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-4 pt-2 border-t border-zinc-100">
        <span className="text-xs text-zinc-500">🔒 Compra segura</span>
        <span className="text-xs text-zinc-500">✓ Garantia de satisfação</span>
      </div>
    </div>
  );
}
