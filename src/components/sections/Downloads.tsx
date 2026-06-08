'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Android, Windows, Download, FileText, History, Ban } from '@icons';
import ChangelogDialog from '@dialog/ChangelogDialog';
import VersionsDialog from '@dialog/VersionsDialog';
import { type Locale } from '@config/locales';

interface DownloadsProps {
  locale: Locale;
  version: string;
  downloadUrl: string;
}

export default function Downloads({ locale, version, downloadUrl }: DownloadsProps) {
  const t = useTranslations();
  const changelogRef = useRef<HTMLDialogElement>(null);
  const versionsRef = useRef<HTMLDialogElement>(null);

  return (
    <section id="downloads" className="px-6 py-24 bg-gradient-to-b from-[#141317] to-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] mb-4 font-['Epilogue']">
            {t('downloads.title')}
          </h2>
          <p className="text-[#cac4d0] max-w-2xl mx-auto">{t('downloads.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Android Card */}
          <div className="glass-card rounded-[3rem] p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#efb8c8]/20 text-[#ffd9e3] flex items-center justify-center flex-shrink-0">
                <Android size={24} />
              </div>
              <div>
                <h3 className="text-[#e5e1e7] font-medium text-[22px] leading-7">Android</h3>
                <p className="text-[#cac4d0] text-sm">{t('downloads.android_subtitle')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="version-chip version-chip--stable">{t('downloads.stable')}</span>
              <span className="version-chip">{version || '—'}</span>
            </div>

            <div className="flex flex-wrap gap-6 mb-8">
              <ChangelogDialog ref={changelogRef} locale={locale} />
              <VersionsDialog ref={versionsRef} locale={locale} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-white/10">
              <a
                href={downloadUrl}
                className="flex items-center gap-3 bg-[#e9ddff] text-[#37265e] px-8 py-3 rounded-full text-sm font-medium ambient-glow hover:brightness-110 active:scale-95 transition-all no-underline"
                target={downloadUrl !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                <Download size={20} />
                {t('downloads.download_apk')}
              </a>
              <p className="text-[#cac4d0] text-[11px] font-medium">{t('downloads.android_req')}</p>
            </div>
          </div>

          {/* Windows Card (Disabled) */}
          <div
            className="glass-card rounded-[3rem] border border-white/5 disabled-card"
            aria-disabled="true"
          >
            <div className="disabled-card__inner p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#201f23] flex items-center justify-center flex-shrink-0">
                  <Windows size={24} className="text-[#cac4d0]" />
                </div>
                <div>
                  <h3 className="text-[#cac4d0] font-medium text-[22px] leading-7">
                    {t('downloads.windows_title')}
                  </h3>
                  <p className="text-[#cac4d0] text-sm">{t('downloads.windows_subtitle')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="version-chip">{t('downloads.closed')}</span>
                <span className="version-chip">{t('downloads.unavailable')}</span>
              </div>

              <div className="flex flex-wrap gap-6 mb-8">
                <span className="flex items-center gap-2 text-[#cac4d0] text-sm font-medium opacity-50">
                  <FileText size={18} />
                  {t('downloads.changelog')}
                </span>
                <span className="flex items-center gap-2 text-[#cac4d0] text-sm font-medium opacity-50">
                  <History size={18} />
                  {t('downloads.versions')}
                </span>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  disabled
                  className="flex items-center gap-3 bg-[#201f23] text-[#cac4d0] px-8 py-3 rounded-full text-sm font-medium cursor-not-allowed"
                >
                  <Ban size={20} />
                  {t('downloads.not_available')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
