'use client';

import { forwardRef, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GitHubRelease } from '@t/github';

interface Props {
  locale: string;
}

const ChangelogDialog = forwardRef<HTMLDialogElement, Props>(({ locale }, ref) => {
  const t = useTranslations();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');

  const close = useCallback(() => {
    if (ref && 'current' in ref) ref.current?.close();
  }, [ref]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (ref && 'current' in ref && e.target === ref.current) close();
    },
    [ref, close],
  );

  const load = useCallback(async () => {
    if (content) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/repos/Arturo254/OpenTune/releases/latest');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as GitHubRelease;
      const dateStr = new Date(data.published_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      setDate(dateStr);
      const body = data.body ?? 'No release notes available.';
      const { marked } = await import('marked');
      setContent(await marked.parse(body));
    } catch {
      setContent('<p style="color:#ffb4ab">Error loading changelog.</p>');
    } finally {
      setLoading(false);
    }
  }, [content, locale]);

  const open = useCallback(() => {
    if (ref && 'current' in ref) {
      ref.current?.showModal();
      void load();
    }
  }, [ref, load]);

  return (
    <>
      <button
        onClick={open}
        className="flex items-center gap-2 text-[#e9ddff] hover:text-[#d0bcff] transition-colors text-sm font-medium"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>list_alt</span>
        {t('downloads.changelog')}
      </button>

      <dialog ref={ref} className="glass-dialog glass-dialog--large" onClick={handleBackdrop}>
        <div className="dialog-header">
          <h3 className="text-[#e5e1e7] font-medium text-[22px] leading-7">{t('changelog.title')}</h3>
          <button className="dialog-icon-btn" onClick={close} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="dialog-content dialog-content--scroll">
          {loading ? (
            <div className="loading-indicator"><div className="circular-progress" /></div>
          ) : content ? (
            <div>
              {date && (
                <div className="changelog-meta">
                  <span className="changelog-date">📅 {date}</span>
                </div>
              )}
              <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            <div className="loading-indicator"><div className="circular-progress" /></div>
          )}
        </div>
      </dialog>
    </>
  );
});

ChangelogDialog.displayName = 'ChangelogDialog';
export default ChangelogDialog;
