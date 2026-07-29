import React from 'react';

interface MobileAppShellProps {
  children: React.ReactNode;
}

export default function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center w-full dark:bg-neutral-900">
      {/* Mobile container that looks like a phone on desktop */}
      <div className="w-full max-w-md bg-background min-h-screen shadow-2xl relative overflow-x-hidden md:border-x md:border-border/40">
        {children}
      </div>
    </div>
  );
}
