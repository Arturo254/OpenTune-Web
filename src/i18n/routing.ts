import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from '@config/locales';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localeCookie: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
