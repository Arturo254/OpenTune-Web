import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { type Locale } from '@config/locales';

export default function SupportCTA({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <section className="px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-[3rem] p-10 text-center border border-white/5">
          <div className="w-14 h-14 rounded-full bg-[#4a4359] flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[#ccc2dc]" style={{ fontSize: 26 }}>support_agent</span>
          </div>
          <h2 className="text-[28px] leading-9 font-semibold text-[#e5e1e7] mb-3 font-['Epilogue']">
            {t('support.title')}
          </h2>
          <p className="text-[#cac4d0] text-base leading-6 mb-8 max-w-md mx-auto">{t('support.body')}</p>
          <Link
            href={`/${locale}/support`}
            className="inline-flex items-center gap-2 bg-[#4a4359] text-[#bab1ca] px-8 py-3 rounded-full text-sm font-medium active:scale-95 transition-all hover:brightness-110 no-underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
            {t('support.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
