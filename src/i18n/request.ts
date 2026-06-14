import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { type Locale } from '@config/locales';
import type { AbstractIntlMessages } from 'next-intl';

import en from '../messages/en.json';
import es from '../messages/es.json';
import hi from '../messages/hi.json';
import pt from '../messages/pt.json';

const messages: Record<Locale, AbstractIntlMessages> = { en, es, hi, pt };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});
