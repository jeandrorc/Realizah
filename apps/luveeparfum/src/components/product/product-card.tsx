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
      <div className="relative overflow-hidden rounded-2xl bg-offwhite shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-nude/30">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-nude/20 flex items-center justify-center">
              <span className="text-cacau/30 text-xs font-display italic">Luvée</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span
              className={`absolute top-2.5 left-2.5 text-cream text-[10px] font-bold px-2.5 py-1 rounded-full ${
                badge === 'OFERTA' ? 'bg-terracota' : 'bg-cacau'
              }`}
            >
              {badge === 'OFERTA' && discountPercent ? `-${discountPercent}%` : badge}
            </span>
          )}

          {/* Hover CTA — desktop */}
          <div className="absolute bottom-0 left-0 right-0 bg-cacau/90 backdrop-blur-sm text-cream text-center text-xs font-medium py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block tracking-wide">
            Adicionar ao Carrinho
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {brand && (
            <p className="font-display italic text-dourado text-xs mb-1 tracking-wide">{brand}</p>
          )}
          <h3 className="font-display text-lg text-cacau line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-cacau">{price}</span>
            {originalPrice && (
              <span className="text-xs text-cacau/40 line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        {/* CTA — mobile */}
        <div className="md:hidden px-4 pb-4">
          <button className="w-full bg-cacau text-cream text-xs font-medium py-2.5 rounded-full">
            + Adicionar
          </button>
        </div>
      </div>
    </Link>
  );
}
