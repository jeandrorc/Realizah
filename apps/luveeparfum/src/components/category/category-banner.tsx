import Image from 'next/image';
import type { CategoryBannerProps } from '@/adapters/category.adapter';

export function CategoryBanner({
  title,
  description,
  imageUrl,
  productCount,
}: CategoryBannerProps) {
  return (
    <div className="relative overflow-hidden h-[280px] md:h-[340px] bg-zinc-900 rounded-b-[16px]">
      {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover opacity-40" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-8">
        <h1 className="font-display text-[48px] md:text-[64px] text-paper leading-tight">
          {title}
        </h1>
        {description && <p className="text-zinc-300 mt-2 max-w-lg">{description}</p>}
        {productCount !== undefined && (
          <p className="text-zinc-500 text-sm mt-2">{productCount} produtos</p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fire via-sun to-fire" />
    </div>
  );
}
