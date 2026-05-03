import Link from 'next/link';
import { Suspense } from 'react';
import { Leaf, HandMetal, Globe, Package } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';
import { FaqSection } from '@/components/home/faq-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { ProductListMounter } from '@/mounters/product/product-list.mounter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luvée Parfum — Art de Parfum Artesanal',
  description:
    'Sabonetes artesanais, velas perfumadas, perfumes e aromas para casa. Ingredientes naturais, feito com amor.',
  openGraph: {
    title: 'Luvée Parfum',
    description: 'Art de parfum artesanal — rituais de bem-estar com ingredientes naturais.',
    type: 'website',
  },
};

/* ─── Skeleton ─────────────────────────────────────────────────── */
function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-nude/30 rounded-2xl h-72 animate-pulse" />
      ))}
    </div>
  );
}

/* ─── Benefits Bar ─────────────────────────────────────────────── */
function BenefitsBar() {
  const items = [
    { icon: Leaf, label: 'Ingredientes Naturais', desc: 'Sem parabenos ou sulfatos' },
    { icon: HandMetal, label: 'Feito à Mão', desc: 'Processo artesanal cuidadoso' },
    { icon: Globe, label: 'Embalagem Eco', desc: 'Materiais sustentáveis e recicláveis' },
    { icon: Package, label: 'Entrega Premium', desc: 'Frete grátis acima de R$ 199' },
  ];

  return (
    <section className="bg-cacau py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-dourado/20 flex items-center justify-center mt-0.5">
                <Icon className="w-4 h-4 text-dourado" />
              </div>
              <div>
                <p className="text-cream text-sm font-medium">{label}</p>
                <p className="text-cream/50 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Categories ───────────────────────────────────────────────── */
const CATEGORIES = [
  {
    label: 'Sabonetes',
    desc: 'Artesanais com óleos essenciais',
    href: '/categories/sabonetes',
    bg: 'bg-nude',
    text: 'text-cacau',
    emoji: '🧼',
  },
  {
    label: 'Velas',
    desc: 'Perfumadas de cera natural',
    href: '/categories/velas',
    bg: 'bg-terracota',
    text: 'text-cream',
    emoji: '🕯️',
  },
  {
    label: 'Perfumes',
    desc: 'Óleos e extratos exclusivos',
    href: '/categories/perfumes',
    bg: 'bg-cacau',
    text: 'text-cream',
    emoji: '✨',
  },
  {
    label: 'Aromas',
    desc: 'Difusores, sachês e sprays',
    href: '/categories/aromas',
    bg: 'bg-oliva',
    text: 'text-cream',
    emoji: '🌿',
  },
  {
    label: 'Kits',
    desc: 'Presenteáveis e edições especiais',
    href: '/categories/kits',
    bg: 'bg-dourado',
    text: 'text-cacau',
    emoji: '🎁',
  },
];

function CategoryShowcase() {
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-display italic text-dourado text-lg mb-2">explore por categoria</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
            Universo Luvée
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`${cat.bg} ${cat.text} rounded-3xl p-6 flex flex-col justify-between aspect-square hover:scale-[1.02] transition-transform duration-300 group`}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <p className="font-display text-2xl mb-1">{cat.label}</p>
                <p className="text-xs opacity-70 group-hover:opacity-90 transition-opacity">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Sensory Lines ────────────────────────────────────────────── */
const SENSORY_LINES = [
  {
    name: 'Aurora',
    desc: 'Delicada, floral e radiante. Para quem ama despertar com leveza.',
    notes: ['Rosa damascena', 'Peônia', 'Almíscar branco'],
    bg: 'bg-[#F2DADA]',
    accent: '#C4706F',
    href: '/collections/aurora',
  },
  {
    name: 'Luna',
    desc: 'Sofisticada, noturna e serena. Para rituais de fim de dia.',
    notes: ['Lavanda', 'Cedro', 'Âmbar'],
    bg: 'bg-[#D8DCF0]',
    accent: '#6B74B8',
    href: '/collections/luna',
  },
  {
    name: 'Terra',
    desc: 'Terrosa, intensa e calorosa. Para quem ama o cheiro da natureza.',
    notes: ['Vetiver', 'Patchouli', 'Sândalo'],
    bg: 'bg-nude',
    accent: '#4E3A2D',
    href: '/collections/terra',
  },
  {
    name: 'Maracujá',
    desc: 'Tropical, vibrante e alegre. Energia que anima qualquer momento.',
    notes: ['Maracujá', 'Tangerina', 'Ylang-ylang'],
    bg: 'bg-maracuja/30',
    accent: '#8A6A10',
    href: '/collections/maracuja',
  },
];

function SensoryLines() {
  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-display italic text-dourado text-lg mb-2">coleções sensoriais</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
            Linhas Assinatura
          </h2>
          <p className="text-cacau/55 mt-4 max-w-lg mx-auto">
            Cada linha foi criada para despertar uma emoção diferente. Encontre a sua.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SENSORY_LINES.map((line) => (
            <Link
              key={line.name}
              href={line.href}
              className={`${line.bg} rounded-3xl p-8 flex flex-col justify-between min-h-[360px] hover:scale-[1.015] transition-transform duration-300 group`}
            >
              <div>
                <h3 className="font-display text-[40px] mb-3" style={{ color: line.accent }}>
                  {line.name}
                </h3>
                <p className="text-cacau/70 text-sm leading-relaxed mb-5">{line.desc}</p>
              </div>
              <div>
                <p className="text-cacau/40 text-xs tracking-widest uppercase mb-2">Notas</p>
                <div className="flex flex-wrap gap-2">
                  {line.notes.map((note) => (
                    <span
                      key={note}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/50 text-cacau"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                <p
                  className="text-sm font-medium mt-6 group-hover:underline underline-offset-2"
                  style={{ color: line.accent }}
                >
                  Explorar →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Dark Perfumes CTA ────────────────────────────────────────── */
function PerfumesSection() {
  return (
    <section className="bg-cacau py-20 md:py-28 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-terracota/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-dourado/10 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <p className="font-display italic text-dourado text-lg mb-4">a essência da Luvée</p>
          <h2 className="font-display text-[56px] md:text-[72px] text-cream leading-[0.95] mb-6">
            Perfumes que
            <br />
            <em className="text-nude">contam histórias</em>
          </h2>
          <p className="text-cream/55 text-lg leading-relaxed mb-10 max-w-md">
            Extratos e óleos perfumados criados com matérias-primas raras. Cada frasco é uma
            narrativa sensorial única.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/categories/perfumes"
              className="inline-flex items-center justify-center bg-dourado text-cacau font-medium px-8 py-3.5 rounded-full hover:bg-dourado/85 transition-colors text-sm tracking-wide w-fit"
            >
              Descobrir perfumes
            </Link>
            <Link
              href="/collections/terra"
              className="inline-flex items-center justify-center border border-cream/20 text-cream font-medium px-8 py-3.5 rounded-full hover:bg-cream/5 transition-colors text-sm tracking-wide w-fit"
            >
              Linha Terra
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Aromas ──────────────────────────────────────────────── */
const AROMAS = [
  {
    label: 'Velas Perfumadas',
    emoji: '🕯️',
    desc: 'Cera de coco e óleos essenciais',
    href: '/categories/velas',
    bg: 'bg-terracota/15',
  },
  {
    label: 'Difusores',
    emoji: '💧',
    desc: 'Aromaterapia contínua para ambientes',
    href: '/categories/difusores',
    bg: 'bg-oliva/15',
  },
  {
    label: 'Sachês',
    emoji: '🌸',
    desc: 'Para gavetas, armários e carros',
    href: '/categories/saches',
    bg: 'bg-nude/60',
  },
];

function HomeAromasSection() {
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-display italic text-dourado text-lg mb-2">seu espaço, seu aroma</p>
            <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
              Aromas para Casa
            </h2>
          </div>
          <Link
            href="/categories/aromas"
            className="text-sm text-cacau/60 hover:text-cacau transition-colors font-medium"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {AROMAS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.bg} rounded-3xl p-8 flex flex-col justify-between min-h-[240px] hover:scale-[1.015] transition-transform duration-300 group`}
            >
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <h3 className="font-display text-3xl text-cacau mb-1">{item.label}</h3>
                <p className="text-cacau/55 text-sm">{item.desc}</p>
                <p className="text-terracota text-sm font-medium mt-4 group-hover:underline underline-offset-2">
                  Explorar →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process Section ──────────────────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Seleção de Ingredientes',
    desc: 'Escolhemos matérias-primas naturais certificadas de produtores responsáveis.',
  },
  {
    n: '02',
    title: 'Formulação Artesanal',
    desc: 'Cada fórmula é desenvolvida em pequenos lotes com atenção a cada detalhe.',
  },
  {
    n: '03',
    title: 'Cura e Maturação',
    desc: 'Os produtos descansam pelo tempo necessário para atingir sua melhor forma.',
  },
  {
    n: '04',
    title: 'Embalagem Sustentável',
    desc: 'Embalamos com materiais ecológicos e recicláveis, com cuidado e carinho.',
  },
];

function ProcessSection() {
  return (
    <section className="bg-nude/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="font-display italic text-dourado text-lg mb-2">feito com cuidado</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
            Nosso Processo
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center">
              <p className="font-display text-[72px] text-nude leading-none mb-4">{step.n}</p>
              <h3 className="font-display text-2xl text-cacau mb-3">{step.title}</h3>
              <p className="text-cacau/55 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Manifesto ────────────────────────────────────────────────── */
function ManifestoSection() {
  return (
    <section className="bg-terracota py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="font-display italic text-cream/60 text-lg mb-6">nossa filosofia</p>
        <blockquote className="font-display text-[36px] md:text-[52px] text-cream leading-[1.1] mb-8">
          &ldquo;Acreditamos que o cotidiano merece ser vivido com intenção — e que um aroma pode
          transformar um simples momento em memória afetiva.&rdquo;
        </blockquote>
        <p className="text-cream/70 leading-relaxed text-lg">
          A Luvée nasceu da convicção de que beleza natural e bem-estar deveriam estar ao alcance de
          todos. Criamos cada produto como um ritual — com ingredientes que respeitam a pele, o lar
          e o planeta.
        </p>
        <div className="mt-10">
          <Link
            href="/about"
            className="inline-flex items-center justify-center border border-cream/30 text-cream font-medium px-8 py-3.5 rounded-full hover:bg-cream/10 transition-colors text-sm tracking-wide"
          >
            Nossa história
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Mariana S.',
    city: 'São Paulo',
    stars: 5,
    text: 'O sabonete de lavanda transformou minha rotina de banho. Cheiro incrível que dura o dia todo. Já na quarta compra!',
  },
  {
    name: 'Juliana P.',
    city: 'Belo Horizonte',
    stars: 5,
    text: 'Presenteei minha mãe com o kit de Natal e ela adorou. A embalagem é linda e os produtos são de uma qualidade impressionante.',
  },
  {
    name: 'Fernanda C.',
    city: 'Rio de Janeiro',
    stars: 5,
    text: 'A vela de âmbar é simplesmente perfeita. Traz uma sensação de aconchego incrível pro ambiente. Recomendo muito!',
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="font-display italic text-dourado text-lg mb-2">quem nos conhece, fica</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
            Depoimentos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-cream rounded-3xl p-8">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-dourado text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-cacau/75 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-display text-xl text-cacau">{t.name}</p>
                <p className="text-cacau/45 text-sm">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />

      <BenefitsBar />

      <CategoryShowcase />

      {/* Produtos em Destaque */}
      <section className="bg-offwhite py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="font-display italic text-dourado text-lg mb-2">mais amados</p>
              <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight">
                Em Destaque
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm text-cacau/60 hover:text-cacau transition-colors font-medium"
            >
              Ver catálogo →
            </Link>
          </div>
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductListMounter limit={8} columns={4} />
          </Suspense>
        </div>
      </section>

      <SensoryLines />

      <PerfumesSection />

      <HomeAromasSection />

      <ProcessSection />

      <ManifestoSection />

      <TestimonialsSection />

      <FaqSection />

      <NewsletterSection />

      {/* Final CTA */}
      <section className="bg-cream py-16 text-center">
        <div className="container mx-auto px-4">
          <p className="font-display italic text-dourado text-lg mb-3">comece seu ritual</p>
          <h2 className="font-display text-[48px] md:text-[64px] text-cacau leading-tight mb-6">
            Encontre o seu aroma
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-cacau text-cream font-medium px-10 py-4 rounded-full hover:bg-cacau/85 transition-colors tracking-wide"
          >
            Explorar toda a linha
          </Link>
        </div>
      </section>
    </>
  );
}
