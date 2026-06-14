'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { Code, ArrowBigDownDash, CirclePlay } from '@icons';
import WarningDialog from '@dialog/WarningDialog';
import { type Locale } from '@config/locales';
import { PATHS } from '@config/links';

export default function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const warningRef = useRef<HTMLDialogElement>(null);

  const openDemo = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    warningRef.current?.showModal();
  }, []);

  return (
    <>
      <WarningDialog ref={warningRef} />

      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-l from-[#d0bcff] to-transparent blur-3xl rounded-full translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="developer-chip inline-flex items-center gap-2 bg-[#4a4359] text-[#bab1ca] px-4 py-2 rounded-full text-[11px] font-medium mb-6">
              <Code size={16} />
              {t('hero.badge')}
            </div>

            <h1 className="text-[57px] leading-[64px] tracking-[-0.25px] font-bold text-[#e9ddff] mb-6 font-epilogue leading-tight">
              OpenTune
            </h1>
            <p className="text-[28px] leading-9 font-semibold text-[#cac4d0] mb-10 max-w-xl font-epilogue">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href={`/${locale}${PATHS.DOWNLOADS}`}
                className="bg-[#e9ddff] text-[#37265e] px-10 py-4 rounded-full text-sm font-medium text-lg flex items-center gap-2 ambient-glow hover:brightness-110 active:scale-95 transition-all no-underline"
              >
                <ArrowBigDownDash size={20} />
                {t('hero.download_apk')}
              </Link>
              <button
                onClick={openDemo}
                className="bg-[#2b292d] text-[#e5e1e7] px-10 py-4 rounded-full text-sm font-medium text-lg border border-[#49454f]/30 hover:bg-[#353438] transition-all flex items-center gap-2"
              >
                <CirclePlay size={20} />
                {t('hero.try_demo')}
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden glass-card p-4 ambient-glow lg:rotate-3 transform">
              <Image
                src="/img/mock.webp"
                alt="OpenTune App Preview"
                width={500}
                height={900}
                className="w-full rounded-2xl"
                priority
              />
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#efb8c8]/20 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </>
  );
}
