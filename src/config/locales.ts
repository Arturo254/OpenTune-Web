import { EXTERNAL_LINKS } from './links';

export const locales = ['en', 'es', 'hi', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeConfig: Record<Locale, { id: string; displayName: string; flag: string }> = {
  en: { id: 'en', displayName: 'English', flag: EXTERNAL_LINKS.FLAG_US },
  es: { id: 'es', displayName: 'Español', flag: EXTERNAL_LINKS.FLAG_ES },
  hi: { id: 'hi', displayName: 'हिन्दी', flag: EXTERNAL_LINKS.FLAG_IN },
  pt: { id: 'pt', displayName: 'Português', flag: EXTERNAL_LINKS.FLAG_PT },
};
