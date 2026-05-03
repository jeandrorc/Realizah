import Image from 'next/image';
import Link from 'next/link';
import type { BrandHeroProps } from '@/adapters/brand.adapter';

export function BrandHero({ title, description, logoUrl, coverUrl, externalUrl }: BrandHeroProps) {
  return (
    <div className="relative overflow-hidden h-[280px] md:h-[340px] bg-zinc-900 rounded-b-[16px]">
      {coverUrl && <Image src={coverUrl} alt={title} fill className="object-cover opacity-40" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-8">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={`Logo ${title}`}
            width={80}
            height={40}
            className="object-contain mb-4 brightness-0 invert"
          />
        )}
        <h1 className="font-display text-[48px] md:text-[64px] text-paper leading-tight">
          {title}
        </h1>
        {description && <p className="text-zinc-300 mt-2 max-w-lg">{description}</p>}
        {externalUrl && (
          <Link
            href={externalUrl}
            target="_blank"
            className="text-sun text-sm mt-2 hover:underline"
          >
            Visitar site oficial ↗
          </Link>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fire via-sun to-fire" />
    </div>
  );
}
