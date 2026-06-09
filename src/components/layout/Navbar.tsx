'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type Locale, localeConfig, locales } from '@config/locales';
import { useCallback, useRef } from 'react';
import { X, Globe, ChevronDown, Download } from '@icons';

export default function Navbar() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params['locale'] as Locale) ?? 'en';
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openLangDialog = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeLangDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {closeLangDialog();}
    },
    [closeLangDialog],
  );

  return (
    <>
      {/* Language Dialog */}
      <dialog
        ref={dialogRef}
        className="glass-dialog"
        onClick={handleBackdropClick}
        aria-labelledby="lang-dialog-title"
      >
        <div className="dialog-header">
          <h2 id="lang-dialog-title" className="text-[#e5e1e7] font-medium text-[22px] leading-7">
            {t('lang.select')}
          </h2>
          <button
            className="dialog-icon-btn"
            onClick={closeLangDialog}
            aria-label={t('lang.close')}
          >
            <X size={24} />
          </button>
        </div>
        <div className="dialog-content">
          <div className="flex flex-col gap-1">
            {locales.map((loc) => {
              const cfg = localeConfig[loc];
              return (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  className="dialog-list-item"
                  onClick={closeLangDialog}
                >
                  <img src={cfg.flag} alt={cfg.id.toUpperCase()} className="flag-icon" />
                  <span className="text-[#e5e1e7] text-base font-normal">{cfg.displayName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </dialog>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/65 backdrop-blur-2xl border-b border-white/10">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 no-underline">
            <Image
              src="/icon/icon-512-maskable.png"
              alt="OpenTune"
              width={34}
              height={34}
              className="rounded-lg"
              priority
            />
            <span className="text-2xl font-black tracking-tighter text-violet-300 font-['Epilogue']">
              OpenTune
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            <Link
              href={`/${locale}#features`}
              className="font-['Epilogue'] font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              {t('nav.features')}
            </Link>
            <Link
              href={`/${locale}#screenshots`}
              className="font-['Epilogue'] font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              {t('nav.screenshots')}
            </Link>
            <Link
              href={`/${locale}#downloads`}
              className="font-['Epilogue'] font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              {t('nav.downloads')}
            </Link>
            <a
              href="https://github.com/Arturo254/OpenTune"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Epilogue'] font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={openLangDialog}
              className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 text-[#cac4d0] transition-colors text-sm font-medium"
              aria-label={t('lang.select')}
            >
              <Globe size={20} />
              <span className="hidden lg:inline text-sm">{locale.toUpperCase()}</span>
              <ChevronDown size={18} />
            </button>

            <Link
              href={`/${locale}#downloads`}
              className="bg-[#d0bcff] text-[#594983] px-5 py-2 rounded-full text-sm font-medium active:scale-95 transition-all duration-200 no-underline hidden sm:inline-flex items-center gap-2"
            >
              <Download size={18} />
              {t('nav.download')}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
