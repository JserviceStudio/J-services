import React from 'react';

interface SidebarProps {
  workspace: 'PUBLIC' | 'CLIENT' | 'RESELLER' | 'ADMIN';
  items: { label: string; href: string; icon?: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ workspace, items }) => {
  const bgColor = {
    PUBLIC: 'bg-slate-50',
    CLIENT: 'bg-blue-50/50',
    RESELLER: 'bg-emerald-50/50',
    ADMIN: 'bg-slate-900',
  }[workspace];

  const textColor = workspace === 'ADMIN' ? 'text-slate-400' : 'text-slate-600';
  const activeTextColor = workspace === 'ADMIN' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`flex flex-col h-full ${bgColor} p-4`}>
      <div className="mb-8 px-2 font-bold text-xl">
        <span className={workspace === 'ADMIN' ? 'text-blue-400' : 'text-blue-600'}>J+</span>
        <span className={workspace === 'ADMIN' ? 'text-white' : 'text-slate-900'}>SERVICES</span>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor} hover:bg-white/10 hover:${activeTextColor}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-200/20 pt-4">
         <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${textColor}/60`}>
            Workspace: {workspace}
         </div>
      </div>
    </div>
  );
};
