import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre nós',
  description: 'Conheça a Realizah — sua plataforma de produtos, cursos e assinaturas.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="font-display text-[40px] text-ink mb-8">Sobre nós</h1>
      <div className="prose prose-zinc max-w-none space-y-4 text-zinc-600">
        <p>
          A Realizah é uma plataforma que une produtos físicos, cursos online e assinaturas em um só
          lugar.
        </p>
        <p>
          Nossa missão é oferecer uma experiência completa de compra e aprendizado, com foco em
          qualidade e facilidade.
        </p>
      </div>
    </div>
  );
}
