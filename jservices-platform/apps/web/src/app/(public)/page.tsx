export default function PublicHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        J+SERVICES Platform
      </h1>
      <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl">
        La plateforme intelligente de gestion et distribution multi-services. Edition 2026.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href="/auth" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Accéder au portail
        </a>
        <a href="/catalog" className="text-sm font-semibold leading-6 text-slate-900">
          Voir le catalogue <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
