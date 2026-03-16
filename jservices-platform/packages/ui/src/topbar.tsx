import React from 'react';

interface TopbarProps {
  title: string;
  user?: { name: string; avatarUrl?: string };
  actions?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, user, actions }) => {
  return (
    <div className="flex-1 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-4">
        {actions && <div className="flex items-center gap-2">{actions}</div>}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
