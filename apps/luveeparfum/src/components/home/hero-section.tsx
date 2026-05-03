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
  title = 'Ritual de\nBem-Estar',
  subtitle = 'Sinta-se em casa com aromas que aquecem a alma e transformam o cotidiano em ritual.',
  ctaLabel = 'Explorar aromas',
  ctaHref = '/products',
  imageUrl = 'https://cdn.2bsolutions.tech/preview/luveeparfum-hero.jpg',
}: HeroSectionProps) {
  return (
    <section className="bg-cream min-h-[88vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          {/* Texto */}
          <div className="order-2 md:order-1">
            <p className="font-display italic text-dourado text-lg tracking-[0.12em] mb-4">
              art de parfum
            </p>
            <h1 className="font-display text-[64px] md:text-[88px] text-cacau leading-[0.92] whitespace-pre-line mb-6">
              {title}
            </h1>
            <p className="text-cacau/65 text-lg md:text-xl max-w-md mb-10 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center bg-cacau text-cream font-medium px-8 py-3.5 rounded-full hover:bg-cacau/85 transition-colors text-sm tracking-wide w-fit"
              >
                {ctaLabel}
              </Link>
              <Link
                href="/categories/kits"
                className="inline-flex items-center justify-center border border-cacau/30 text-cacau font-medium px-8 py-3.5 rounded-full hover:bg-cacau/5 transition-colors text-sm tracking-wide w-fit"
              >
                Ver kits
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-nude/40">
              <div className="text-center">
                <p className="font-display text-3xl text-cacau">4.9</p>
                <p className="text-cacau/50 text-xs mt-0.5">avaliação média</p>
              </div>
              <div className="w-px h-10 bg-nude/40" />
              <div className="text-center">
                <p className="font-display text-3xl text-cacau">2.8k</p>
                <p className="text-cacau/50 text-xs mt-0.5">clientes felizes</p>
              </div>
              <div className="w-px h-10 bg-nude/40" />
              <div className="text-center">
                <p className="font-display text-3xl text-cacau">100%</p>
                <p className="text-cacau/50 text-xs mt-0.5">ingredientes naturais</p>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="order-1 md:order-2 relative">
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-nude/30">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Luvée Parfum — Ritual de Bem-Estar"
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Decorative badge */}
              <div className="absolute top-6 right-6 bg-offwhite/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-card">
                <p className="font-display italic text-dourado text-sm">feito à mão</p>
              </div>
            </div>
            {/* Floating scent note */}
            <div className="absolute -bottom-4 -left-4 bg-cacau text-cream rounded-2xl px-5 py-3 shadow-modal">
              <p className="font-display italic text-nude text-xs mb-0.5">nota do dia</p>
              <p className="font-display text-lg text-cream">Sândalo & Baunilha</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
