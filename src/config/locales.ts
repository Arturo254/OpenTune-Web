export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeConfig: Record<Locale, { id: Locale; displayName: string; flag: string }> = {
  en: { id: 'en', displayName: 'English', flag: 'https://flagicons.lipis.dev/flags/4x3/us.svg' },
  es: { id: 'es', displayName: 'Español', flag: 'https://flagicons.lipis.dev/flags/4x3/es.svg' },
};
