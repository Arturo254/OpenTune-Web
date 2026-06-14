'use client';

import { forwardRef, useCallback, useState } from 'react';
import { History, X, Download } from '@icons';
import { useTranslations } from 'next-intl';
import type { GitHubRelease } from '@t/github';
import { buildDownloadUrl, REPOS } from '@lib/github';

interface Props {
  locale: string;
}

function getReleaseType(release: GitHubRelease): 'stable' | 'beta' | 'alpha' {
  if (release.tag_name.toLowerCase().includes('alpha')) {
    return 'alpha';
  }
  if (release.prerelease) {
    return 'beta';
  }
  return 'stable';
}

const VersionsDialog = forwardRef<HTMLDialogElement, Props>(({ locale: $locale }, ref) => {
  void $locale;
  const t = useTranslations();
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    if (ref && 'current' in ref) {
      ref.current?.close();
    }
  }, [ref]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (ref && 'current' in ref && e.target === ref.current) {
        close();
      }
    },
    [ref, close],
  );

  const load = useCallback(async () => {
    if (releases.length > 0) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/github/releases?per_page=20");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setReleases((await res.json()) as GitHubRelease[]);
    } catch {
      setReleases([]);
    } finally {
      setLoading(false);
    }
  }, [releases.length]);

  const open = useCallback(() => {
    if (ref && 'current' in ref) {
      ref.current?.showModal();
      void load();
    }
  }, [ref, load]);

  const chipLabel = (type: 'stable' | 'beta' | 'alpha') => {
    const map = { stable: t('versions.stable'), beta: 'Beta', alpha: 'Alpha' };
    return map[type];
  };

  return (
    <>
      <button
        onClick={open}
        className="flex items-center gap-2 text-[#e9ddff] hover:text-[#d0bcff] transition-colors text-sm font-medium"
      >
        <History size={18} />
        {t('downloads.versions')}
      </button>

      <dialog ref={ref} className="glass-dialog glass-dialog--large" onClick={handleBackdrop}>
        <div className="dialog-header">
          <h3 className="text-[#e5e1e7] font-medium text-[22px] leading-7">
            {t('versions.title')}
          </h3>
          <button className="dialog-icon-btn" onClick={close} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <div className="dialog-content dialog-content--scroll">
          {loading ? (
            <div className="loading-indicator">
              <div className="circular-progress" />
            </div>
          ) : releases.length > 0 ? (
            <div>
              {releases.map((release, i) => {
                const type = getReleaseType(release);
                const dateStr = new Date(release.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                const url =
                  release.assets[0]?.browser_download_url ??
                  buildDownloadUrl(REPOS.android, release.tag_name);
                return (
                  <div key={release.tag_name} className="version-list-item">
                    <div className="version-list-info">
                      <div className="version-meta-row">
                        <span className="version-tag">{release.tag_name}</span>
                        {i === 0 && (
                          <span className="version-chip version-chip--latest">
                            {t('versions.latest')}
                          </span>
                        )}
                        <span className={`version-chip version-chip--${type}`}>
                          {chipLabel(type)}
                        </span>
                      </div>
                      <span className="version-date">{dateStr}</span>
                    </div>
                    <a
                      href={url}
                      className="version-dl-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={16} />
                      {t('downloads.download')}
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="loading-indicator">
              <div className="circular-progress" />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
});

VersionsDialog.displayName = 'VersionsDialog';
export default VersionsDialog;
