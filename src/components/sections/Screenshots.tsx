'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { ChevronDown } from '@icons';

const SHOTS = [
  { src: '/img/reproductor.webp', labelKey: 'screenshots.player', alt: 'Player Screen' },
  { src: '/img/biblioteca.webp', labelKey: 'screenshots.library', alt: 'Library Screen' },
  { src: '/img/ajustes.webp', labelKey: 'screenshots.settings', alt: 'Settings Screen' },
];

export default function Screenshots() {
  const t = useTranslations();
  const contentRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') { return true; }
    return localStorage.getItem('screenshotsCollapsed') !== 'false';
  });

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('screenshotsCollapsed', String(next));
      return next;
    });
  }, []);

  return (
    <section id="screenshots" className="px-6 py-24 bg-[#141317]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={toggle}
            role="button"
            aria-expanded={!collapsed}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggle()}
          >
            <div>
              <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] font-epilogue">
                {t('screenshots.title')}
              </h2>
              <p className="text-[#cac4d0] mt-2">{t('screenshots.subtitle')}</p>
            </div>
            <button
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label={t('screenshots.expand')}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              <ChevronDown
                size={24}
                className={`text-[#cac4d0] transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
              />
            </button>
          </div>
        </div>

        <div ref={contentRef} className={collapsed ? 'collapsed' : ''}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SHOTS.map((shot, i) => (
              <div
                key={shot.src}
                className={`space-y-6${i === 1 ? ' lg:mt-12' : i === 2 ? ' lg:mt-24' : ''}`}
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 ambient-glow transition-transform hover:-translate-y-2 aspect-[9/16]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={400}
                    height={711}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-center font-medium text-base text-[#ccc2dc]">
                  {t(shot.labelKey as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
