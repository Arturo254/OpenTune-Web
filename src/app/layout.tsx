import type { Metadata } from 'next';
import Script from 'next/script';
import { Epilogue, Be_Vietnam_Pro } from 'next/font/google';
import '@/app/globals.css';

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

export const metadata: Metadata = {
  title: 'OpenTune',
  description: 'A YouTube Music client with Material Design 3, for Android.',
  icons: {
    icon: '/icon/favicon.ico',
    apple: '/icon/icon-512.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${epilogue.variable} ${beVietnamPro.variable}`}>
      <body className="min-h-screen">
        {children}
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
