import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Headset, Send } from '@icons';
import { type Locale } from '@config/locales';

export default function SupportCTA({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <section className="px-6 py-24 bg-[#0e0e11]">
      <div className="max-w-4xl mx-auto glass-card rounded-[3rem] p-12 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#ffd9e3]/10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#4a4359]/60 rounded-full flex items-center justify-center mx-auto mb-8">
            <Headset size={26} color="#ccc2dc" />
          </div>
          <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] mb-6 font-['Epilogue']">
            {t('support.title')}
          </h2>
          <p className="text-[#cac4d0] text-base mb-10 max-w-lg mx-auto">{t('support.body')}</p>
          <Link
            href={`/${locale}/support`}
            className="inline-flex items-center gap-2 bg-[#d0bcff] text-[#37265e] px-10 py-4 rounded-full text-sm font-medium hover:brightness-110 active:scale-95 transition-all no-underline"
          >
            <Send size={18} />
            {t('support.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
