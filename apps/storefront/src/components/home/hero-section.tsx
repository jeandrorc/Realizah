import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
}

export function HeroSection({
  title = 'TUDO QUE\nVOCÊ PRECISA',
  subtitle = 'Produtos, cursos e assinaturas em um só lugar.',
  ctaLabel = 'Explorar agora',
  ctaHref = '/products',
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 pt-6">
      <div className="relative overflow-hidden rounded-[16px] max-h-[600px] bg-ink">
        {imageUrl ? (
          <Image src={imageUrl} alt="Hero" fill className="object-cover opacity-50" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-ink to-zinc-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-center min-h-[400px] md:min-h-[500px] px-8 md:px-16 py-12">
          <h1 className="font-display text-[56px] md:text-[80px] text-paper leading-[0.95] whitespace-pre-line mb-4">
            {title}
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-md mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-sun text-ink font-semibold px-8 py-3 rounded-md hover:bg-yellow-400 transition-colors text-sm w-fit"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center border border-paper/30 text-paper font-semibold px-8 py-3 rounded-md hover:bg-paper/10 transition-colors text-sm w-fit"
            >
              Ver cursos
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fire via-sun to-fire" />
      </div>
    </section>
  );
}
