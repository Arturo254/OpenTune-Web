import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { type Locale } from '@config/locales';
import Script from 'next/script';
import { Epilogue, Be_Vietnam_Pro } from 'next/font/google';
import '@/app/globals.css';
import { Viewport } from 'next';

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-epilogue-next',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-be-vietnam-pro-next',
});

export const viewport: Viewport = {
  themeColor: '#d0bcff',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.default' });

  return {
    title: {
      template: `%s | OpenTune`,
      default: t('title'),
    },
    description: t('description'),
    metadataBase: new URL('https://opentune.app'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: [
        { url: '/icon/favicon.ico', sizes: 'any' },
        { url: '/icon/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icon/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [
        { url: '/icon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/icon/opentune-black.svg',
        },
      ],
    },
    openGraph: {
      type: 'website',
      siteName: 'OpenTune',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: 'OpenTune - Material Design 3 YouTube Music Client',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-image.png'],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${epilogue.variable} ${beVietnamPro.variable}`}
    >
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6JTGMLLK8S"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6JTGMLLK8S');`}
        </Script>
      </body>
    </html>
  );
}
