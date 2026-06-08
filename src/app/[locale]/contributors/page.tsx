import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { type Locale } from '@config/locales';
import Navbar from '@cmp/layout/Navbar';
import Footer from '@cmp/layout/Footer';
import ContributorsClient from '@cmp/sections/ContributorsClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContributorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <ContributorsClient locale={locale as Locale} />
      </main>
      <div className="pb-24 md:pb-0">
        <Footer locale={locale as Locale} />
      </div>
    </>
  );
}
