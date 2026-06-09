'use client';

import Link from 'next/link';
import { Home } from '@icons';
import type { ComponentType } from 'react';

interface MobileBottomNavProps {
  /** href for the left Home button */
  homeHref: string;
  /** Label shown under the Home icon */
  homeLabel: string;
  /** Icon component for the right (active) tab — any lucide-react or custom icon */
  activeIcon: ComponentType<{ size?: number | string; className?: string }>;
  /** Label shown under the active icon */
  activeLabel: string;
}

export default function MobileBottomNav({
  homeHref,
  homeLabel,
  activeIcon: ActiveIcon,
  activeLabel,
}: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-6 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] rounded-t-2xl">
      <Link
        href={homeHref}
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-violet-100 active:scale-90 transition-all duration-200"
      >
        <Home size={24} />
        <span className="font-['Epilogue'] text-[10px] font-semibold uppercase tracking-tighter mt-1">
          {homeLabel}
        </span>
      </Link>

      <div className="flex flex-col items-center justify-center bg-violet-900/40 text-violet-200 rounded-full px-5 py-1.5 active:scale-90 duration-200">
        <ActiveIcon size={24} />
        <span className="font-['Epilogue'] text-[10px] font-semibold uppercase tracking-tighter mt-1">
          {activeLabel}
        </span>
      </div>
    </nav>
  );
}
