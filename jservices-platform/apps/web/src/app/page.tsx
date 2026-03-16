"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// --- Custom Premium Icons (SVG) ---

const GamingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M6 12h4m-2-2v4M15 11h.01M18 13h.01M3 13c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6s-2.686 6-6 6H9c-3.314 0-6-2.686-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LiveCommerceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 18V9m0 0l-3 3m3-3l3 3M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

const ArtisanIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-3 3zM10 14l-4 4m6-6l-3-3m0 9l3-3m-3 3h-2v2H7v2H5v2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.3 10L14 14.3m4.3-4.3l1.4 1.4M14 14.3l-1.4-1.4M14 14.3l-5 5a2 2 0 01-2.8 0l-1.5-1.5a2 2 0 010-2.8l5-5L14 14.3z" />
  </svg>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen selection:bg-blue-500/30">
      {/* Navigation - Material Blur */}
      <nav className="fixed top-0 w-full z-50 glass-panel py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">J+</div>
            <span className="font-display font-black tracking-tight text-2xl">SERVICES</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-bold opacity-80 uppercase tracking-widest">
              <Link href="/catalog" className="hover:text-blue-600 transition-colors">Catalog</Link>
              <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:scale-110 transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link href="/auth" className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold transition-all hover:shadow-xl hover:-translate-y-0.5">
              Portail
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Immersive & Motion */}
      <section className="relative pt-40 pb-24 px-6 min-h-[95vh] flex items-center overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full animate-float pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Overlapping Blue Gradient Card (2:4 Ratio style) */}
          <div className="absolute -left-20 top-20 w-[45vw] h-[85vh] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[5rem] -rotate-6 opacity-90 shadow-5xl -z-10 animate-float" />
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 text-blue-700 dark:text-blue-200 text-xs font-black uppercase tracking-[0.25em] mb-12 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            L'Innovation Elite Africaine
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.85] animate-fade-in [animation-delay:150ms] selection:text-white text-foreground drop-shadow-2xl">
            L'Avenir de<br />l'Entreprise<br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white drop-shadow-lg">Locales.</span>
          </h1>

          <p className="max-w-2xl text-xl md:text-2xl text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-16 animate-fade-in [animation-delay:300ms]">
            J+SERVICES est le hub technologique indispensable qui automatise et propulse les business de proximité en Afrique. Gaming, Social Commerce, Artisans : Tout est là.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in [animation-delay:450ms]">
            <Link href="/auth" className="group relative px-10 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40">
              <span className="relative z-10">Lancer mon Business</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/catalog" className="px-10 py-6 bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1">
              Explorer le Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Product Hub - Material Surfaces with Fullbg Icons */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12 text-center lg:text-left">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-[8rem] font-black mb-8 leading-none tracking-tighter animate-fade-in">Un Hub.<br />Des Solutions.</h2>
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">Chaque section de l'économie locale mérite une interface de classe mondiale et une automatisation sans faille.</p>
            </div>
            <Link href="/catalog" className="group flex items-center gap-4 px-10 py-5 bg-[var(--surface)] rounded-[2.5rem] font-black shadow-premium hover:shadow-xl transition-all hover:-translate-y-1 border border-[var(--border)] text-xl">
              Tout voir <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'GAMEMO', 
                desc: 'Gestion de salles de jeux. Contrôle de session, facturation et fidélité client.', 
                Icon: GamingIcon, 
                accent: 'blue',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-500/10'
              },
              { 
                title: 'Live Commerce', 
                desc: 'Ventes TikTok & FB Live. Paiements mobiles et stock synchrone.', 
                Icon: LiveCommerceIcon, 
                accent: 'pink',
                color: 'text-pink-600 dark:text-pink-400',
                bg: 'bg-pink-500/10'
              },
              { 
                title: 'Artisan Hub', 
                desc: 'Espace pro pour artisans. Visibilité locale, devis et gestion simplifiée.', 
                Icon: ArtisanIcon, 
                accent: 'orange',
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-500/10'
              },
            ].map((prod) => (
              <div key={prod.title} className="material-card group hover:shadow-2xl relative overflow-hidden flex flex-col justify-between h-full pt-16">
                {/* Full Background SVG Backdrop */}
                <prod.Icon className="absolute -right-12 -top-12 w-64 h-64 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-125 group-hover:-translate-x-8 transition-transform duration-700" />
                
                <div>
                  <div className={`w-24 h-24 rounded-3xl ${prod.bg} flex items-center justify-center ${prod.color} mb-12 shadow-inner group-hover:scale-110 transition-all duration-500`}>
                    <prod.Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-5xl font-black mb-8 tracking-tighter">{prod.title}</h3>
                  <p className="text-slate-500 text-xl font-medium leading-[1.6] mb-12">
                    {prod.desc}
                  </p>
                </div>

                <div>
                  <div className="w-full h-px bg-slate-200/50 dark:bg-slate-700/50 mb-10" />
                  <Link href={`/products/${prod.title.toLowerCase().replace(' ', '-')}`} className={`inline-flex items-center gap-3 font-black ${prod.color} text-xl group-hover:gap-6 transition-all`}>
                    Découvrir l'Interface
                    <span className="text-2xl pt-0.5">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section - Immersive Showcase */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 glass-panel p-6 rounded-[4.5rem] shadow-5xl max-w-[500px] mx-auto animate-float border border-white/10 scale-105">
                <img 
                  src="/mikhmoai-showcase.png" 
                  alt="MikmoAI Elite Interface" 
                  className="w-full h-auto rounded-[3.5rem] shadow-2xl" 
                />
                <div className="absolute -bottom-10 -right-10 bg-green-500 text-white p-7 rounded-[2.5rem] shadow-2xl animate-pulse">
                  <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Status</div>
                  <div className="text-2xl font-black">ONLINE</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="px-6 py-2.5 rounded-full bg-teal-100/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-black uppercase tracking-[0.3em] mb-12 border border-teal-200/50 inline-block">
                Solution Phare
              </div>
              <h2 className="text-6xl md:text-[8rem] font-black mb-10 tracking-tighter leading-[0.9]">MikmoAI : <br />Le Roi du Wifi.</h2>
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16">
                L'excellence technologique pour votre hotspot. L'IA Moailte révolutionne la gestion MikroTik pour une profitabilité maximale.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                {[
                  { label: 'Protocole V7', val: 'Native Support', desc: 'Optimisé pour les derniers firmwares RouterOS.' },
                  { label: 'Cloud IA', val: 'Moailte v4', desc: 'Automatisation intelligente des vouchers.' },
                ].map((stat) => (
                  <div key={stat.label} className="material-card !p-8 !rounded-[2.5rem] hover:!translate-y-0 hover:!scale-105">
                    <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">{stat.label}</div>
                    <div className="text-2xl font-black mb-3">{stat.val}</div>
                    <div className="text-sm font-medium text-slate-500 leading-relaxed">{stat.desc}</div>
                  </div>
                ))}
              </div>

              <Link href="https://mikhmoai.com/" className="inline-block px-12 py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Télécharger l'APK
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee - Brand Power */}
      <section className="py-32 border-y border-[var(--border)] bg-surface-alt overflow-hidden">
        <div className="relative group">
          <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[
              'MIKROTIK', 'TIKTOK', 'FACEBOOK', 'GAMEMO', 'ARTISAN HUB', 'AFRICA TECH', 'J+SERVICES',
              'MIKROTIK', 'TIKTOK', 'FACEBOOK', 'GAMEMO', 'ARTISAN HUB', 'AFRICA TECH', 'J+SERVICES'
            ].map((brand, i) => (
              <span key={i} className="text-6xl md:text-[8rem] font-black text-slate-200 dark:text-slate-800/50 mx-16 tracking-tighter hover:text-blue-600 transition-colors pointer-events-none select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Area */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-12 leading-none">Prêt à <br />Dominer ?</h2>
          <p className="text-2xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto">Rejoignez l'élite des entrepreneurs africains propulsés par J+SERVICES.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link href="/auth" className="px-12 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
              Lancer mon Business
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="font-display font-black text-2xl mb-6 opacity-30">J+ SERVICES</div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.4em]">
          Edition 2026 • L'Innovation Sans Limite
        </p>
      </footer>
    </main>
  );
}
