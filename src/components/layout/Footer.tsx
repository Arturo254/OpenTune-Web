import { useTranslations } from 'next-intl';
import { MobileCode, Code, Scale, Phone, Crowdsource, LifeBuoy } from '@icons';
import Link from 'next/link';
import { type Locale } from '@config/locales';
import { EXTERNAL_LINKS, PATHS } from '@config/links';

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <footer className="bg-slate-950 w-full py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
          <div className="text-center lg:text-left">
            <span className="text-xl font-black text-slate-100 font-epilogue">OpenTune</span>
            <p className="text-slate-500 font-epilogue text-sm mt-1">
              {t('footer.copyright')}{' '}
              <a
                href={EXTERNAL_LINKS.GITHUB_DEV}
                className="text-violet-300 hover:text-violet-200 no-underline transition-colors"
              >
                Arturo.inc™
              </a>
              {'. '}
              {t('footer.rights')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={EXTERNAL_LINKS.GITHUB_DEV}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chip"
            >
              <MobileCode size={16} />
              {t('footer.dev')}
            </a>
            <a
              href={EXTERNAL_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chip"
            >
              <Code size={16} />
              {t('footer.source')}
            </a>
            <a
              href={EXTERNAL_LINKS.LICENSE}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chip"
            >
              <Scale size={16} />
              {t('footer.license')}
            </a>
            <a
              href={EXTERNAL_LINKS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-chip"
            >
              <Phone size={16} />
              {t('footer.contact')}
            </a>
            <Link href={`/${locale}${PATHS.CONTRIBUTORS}`} className="footer-chip">
              <Crowdsource size={16} />
              {t('footer.contributors')}
            </Link>
            <Link href={`/${locale}${PATHS.SUPPORT}`} className="footer-chip">
              <LifeBuoy size={16} />
              {t('footer.support')}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-epilogue">{t('footer.text')}</p>
          <div className="flex gap-6">
            <Link
              href={'https://gh-perma.pages.dev?id=87346871'}
              className="text-slate-500 hover:text-violet-200 transition-colors font-epilogue text-sm no-underline"
            >
              Arturo254
            </Link>
            <Link
              href={`/${locale}${PATHS.DOWNLOADS}`}
              className="text-slate-500 hover:text-violet-200 transition-colors font-epilogue text-sm no-underline"
            >
              {t('nav.downloads')}
            </Link>
            <a
              href={'https://gh-perma.pages.dev?id=172272341'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-violet-200 transition-colors font-epilogue text-sm no-underline"
            >
              Rajnish
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
