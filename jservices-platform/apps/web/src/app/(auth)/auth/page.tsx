export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-900 leading-normal">
        Connexion J+SERVICES
      </h1>
      <p className="mt-4 text-slate-600">
        Portail d'accès unifié aux workspaces de la plateforme.
      </p>
      <div className="mt-8 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md">
         <p className="text-slate-400 italic">[Simulated Auth Form]</p>
         <div className="mt-6 flex flex-col gap-3">
            <a href="/admin" className="p-3 bg-slate-900 text-white rounded-lg font-medium">Simuler Login Admin</a>
            <a href="/client" className="p-3 bg-blue-600 text-white rounded-lg font-medium">Simuler Login Client</a>
            <a href="/reseller" className="p-3 bg-emerald-600 text-white rounded-lg font-medium">Simuler Login Partner</a>
         </div>
      </div>
    </div>
  );
}
