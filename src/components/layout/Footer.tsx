import { useTranslations } from 'next-intl';
import { Monitor, Code, FileText, Smartphone, Users, LifeBuoy } from '@icons';
import Link from 'next/link';
import { type Locale } from '@config/locales';

const GITHUB = 'https://github.com/Arturo254/OpenTune';
const GITHUB_DEV = 'https://github.com/Arturo254/';
const LICENSE_URL = 'https://raw.githubusercontent.com/Arturo254/OpenTune/master/LICENSE';
const WHATSAPP = 'https://wa.me/5576847925';

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <footer className="bg-slate-950 w-full py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
          <div className="text-center lg:text-left">
            <span className="text-xl font-black text-slate-100 font-['Epilogue']">OpenTune</span>
            <p className="text-slate-500 font-['Epilogue'] text-sm mt-1">
              {t('footer.copyright')}{' '}
              <a
                href={GITHUB_DEV}
                className="text-violet-300 hover:text-violet-200 no-underline transition-colors"
              >
                Arturo.inc™
              </a>
              {'. '}
              {t('footer.rights')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <a href={GITHUB_DEV} target="_blank" rel="noopener noreferrer" className="footer-chip">
              <Monitor size={16} />
              {t('footer.dev')}
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="footer-chip">
              <Code size={16} />
              {t('footer.source')}
            </a>
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className="footer-chip">
              <FileText size={16} />
              {t('footer.license')}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="footer-chip">
              <Smartphone size={16} />
              {t('footer.contact')}
            </a>
            <Link href={`/${locale}/contributors`} className="footer-chip">
              <Users size={16} />
              {t('footer.contributors')}
            </Link>
            <Link href={`/${locale}/support`} className="footer-chip">
              <LifeBuoy size={16} />
              {t('footer.support')}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-['Epilogue']">{t('footer.license_text')}</p>
          <div className="flex gap-6">
            <Link
              href={`/${locale}#features`}
              className="text-slate-500 hover:text-violet-200 transition-colors font-['Epilogue'] text-sm no-underline"
            >
              {t('nav.features')}
            </Link>
            <Link
              href={`/${locale}#downloads`}
              className="text-slate-500 hover:text-violet-200 transition-colors font-['Epilogue'] text-sm no-underline"
            >
              {t('nav.downloads')}
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-violet-200 transition-colors font-['Epilogue'] text-sm no-underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
