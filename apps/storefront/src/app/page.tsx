export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Realizah</h1>
        <p className="text-xl text-gray-600">
          Plataforma híbrida de e-commerce, produtos digitais e assinaturas
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/store"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Loja
          </a>
          <a
            href="/courses"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Cursos
          </a>
        </div>
      </div>
    </main>
  );
}
