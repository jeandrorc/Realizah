import Link from 'next/link';
import Image from 'next/image';
import type { ProductCardProps } from '@/adapters/product.adapter';

export function ProductCard({
  title,
  handle,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
  badge,
  brand,
}: ProductCardProps) {
  return (
    <Link href={`/products/${handle}`} className="group block">
      <div className="relative overflow-hidden rounded-md bg-surface shadow-card hover:shadow-card-hover transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
              <span className="text-zinc-400 text-xs">Sem imagem</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span
              className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-sm ${
                badge === 'OFERTA' ? 'bg-fire' : 'bg-zinc-800'
              }`}
            >
              {badge === 'OFERTA' && discountPercent ? `-${discountPercent}%` : badge}
            </span>
          )}

          {/* Hover CTA — desktop */}
          <div className="absolute bottom-0 left-0 right-0 bg-ink text-paper text-center text-xs font-semibold py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden md:block">
            Adicionar ao Carrinho
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {brand && <p className="text-xs text-zinc-500 mb-1">{brand}</p>}
          <h3 className="text-sm font-medium text-ink line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-ink">{price}</span>
            {originalPrice && (
              <span className="text-xs text-zinc-400 line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        {/* CTA — mobile */}
        <div className="md:hidden px-3 pb-3">
          <button className="w-full bg-ink text-paper text-xs font-semibold py-2 rounded-sm">
            + Adicionar
          </button>
        </div>
      </div>
    </Link>
  );
}
