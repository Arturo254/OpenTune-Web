'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StarPlus, BadgeCheck } from '@icons';

const GITHUB = 'https://github.com/Arturo254/OpenTune';

export default function OpenSource() {
  const t = useTranslations();
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    fetch('https://api.github.com/repos/Arturo254/OpenTune/releases/latest')
      .then((r) => r.json())
      .then((d: { tag_name?: string }) => setVersion(d.tag_name ?? 'N/A'))
      .catch(() => setVersion('N/A'));
  }, []);

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center md:text-left">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4a4359] text-[#bab1ca] text-[11px] font-medium mb-6">
            {t('oss.badge')}
          </span>
          <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] mb-6 font-epilogue">
            {t('oss.title')}
          </h2>
          <p className="text-[#cac4d0] text-base leading-6 mb-8">{t('oss.body')}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#e5e1e7] text-[#141317] px-8 py-3 rounded-full text-sm font-medium active:scale-95 transition-all no-underline"
            >
              <StarPlus size={20} />
              {t('oss.star')}
            </a>
            <div className="flex items-center gap-2 px-6 py-3 border border-[#49454f] rounded-full text-[#e5e1e7]">
              <span className="font-medium text-base">{t('oss.license')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full md:w-auto items-center">
          <div className="bg-[#2b292d] p-6 rounded-2xl flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#d0bcff]/20 flex items-center justify-center flex-shrink-0">
              <Image
                src="https://avatars.githubusercontent.com/u/87346871?v=4"
                className="rounded-full"
                alt="Arturo254"
                width={48}
                height={48}
                unoptimized
              />
            </div>
            <div>
              <p className="text-[#e5e1e7] font-medium text-base">Arturo254</p>
              <p className="text-[#cac4d0] text-sm">{t('oss.lead')}</p>
            </div>
          </div>
          <div className="bg-[#2b292d] p-6 rounded-2xl flex items-center gap-4 border border-white/5 md:translate-x-8">
            <div className="w-12 h-12 rounded-full bg-[#4a4359]/60 flex items-center justify-center flex-shrink-0">
              <BadgeCheck size={24} className="text-[#ccc2dc]" />
            </div>
            <div>
              <p className="text-[#e5e1e7] font-medium text-base">{t('oss.latest_version')}</p>
              <p className="text-[#cac4d0] text-sm">{version || t('oss.loading')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#e9ddff]/5 blur-3xl -z-0 pointer-events-none" />
    </section>
  );
}
