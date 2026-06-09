'use client';

import { useCallback, forwardRef } from 'react';
import { TriangleAlert } from '@icons';
import { useTranslations } from 'next-intl';

const DEMO_URL = 'https://appetize.io/app/b_yb62tcjuqzqjvctnswv3krpnmm';

const WarningDialog = forwardRef<HTMLDialogElement>((_, ref) => {
  const t = useTranslations();

  const close = useCallback(() => {
    if (ref && 'current' in ref) {
      ref.current?.close();
    }
  }, [ref]);

  const proceed = useCallback(() => {
    window.location.href = DEMO_URL;
  }, []);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (ref && 'current' in ref && e.target === ref.current) {
        close();
      }
    },
    [ref, close],
  );

  return (
    <dialog ref={ref} className="glass-dialog" onClick={handleBackdrop}>
      <div className="dialog-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4a4359] flex items-center justify-center flex-shrink-0">
            <TriangleAlert size={20} className="text-[#ccc2dc]" />
          </div>
          <h2 className="text-[#e5e1e7] font-medium text-[22px] leading-7">{t('warning.title')}</h2>
        </div>
      </div>
      <div className="dialog-content">
        <p className="text-[#cac4d0] text-base leading-6">{t('warning.body')}</p>
      </div>
      <div className="dialog-actions">
        <button className="dialog-text-btn" onClick={close}>
          {t('warning.cancel')}
        </button>
        <button className="dialog-filled-btn" onClick={proceed}>
          {t('warning.continue')}
        </button>
      </div>
    </dialog>
  );
});

WarningDialog.displayName = 'WarningDialog';
export default WarningDialog;
