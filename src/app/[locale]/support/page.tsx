import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { type Locale } from '@config/locales';
import Navbar from '@cmp/layout/Navbar';
import Footer from '@cmp/layout/Footer';
import SupportClient from '@cmp/sections/SupportClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.support' });

  return {
    title: 'Support',
    description: t('description'),
    alternates: {
      canonical: `/${locale}/support`,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <SupportClient locale={locale as Locale} />
      <div className="pb-24 md:pb-0">
        <Footer locale={locale as Locale} />
      </div>
    </>
  );
}
