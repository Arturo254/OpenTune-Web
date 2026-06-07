import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { type Locale } from '@config/locales';
import Navbar from '@cmp/layout/Navbar';
import Footer from '@cmp/layout/Footer';
import Hero from '@cmp/sections/Hero';
import Features from '@cmp/sections/Features';
import OpenSource from '@cmp/sections/OpenSource';
import Screenshots from '@cmp/sections/Screenshots';
import SupportCTA from '@cmp/sections/SupportCTA';
import Downloads from '@cmp/sections/Downloads';
import { fetchLatestRelease, buildDownloadUrl, REPOS } from '@lib/github';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const release = await fetchLatestRelease(REPOS.android);
  const version = release?.tag_name ?? '';
  const downloadUrl = version ? buildDownloadUrl(REPOS.android, version) : '#';

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Hero locale={locale as Locale} />
        <Features />
        <OpenSource />
        <Screenshots />
        <SupportCTA locale={locale as Locale} />
        <Downloads locale={locale as Locale} version={version} downloadUrl={downloadUrl} />
      </main>
      <Footer locale={locale as Locale} />
    </>
  );
}
