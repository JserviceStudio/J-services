import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, sidebar, topbar }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebar && (
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col">
          {sidebar}
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {topbar && (
          <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6">
            {topbar}
          </header>
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
