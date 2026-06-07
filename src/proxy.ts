import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { locales, defaultLocale, type Locale } from '@config/locales';

const intlMiddleware = createMiddleware(routing);

/** O(1) locale membership test */
const LOCALE_SET = new Set<string>(locales);

/** Matches a leading locale segment: /en  /en/path  — not /english */
const LOCALE_PREFIX_RE = new RegExp(`^/(${locales.join('|')})(/|$)`);

/**
 * Detect the user's preferred locale:
 *  1. NEXT_LOCALE cookie
 *  2. Accept-Language header
 *  3. Site default
 */
function detectLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && LOCALE_SET.has(cookie)) return cookie as Locale;

  const acceptLang = req.headers.get('accept-language');
  if (acceptLang) {
    for (const seg of acceptLang.split(',')) {
      const tag = seg.split(';')[0]!.trim().split('-')[0]!.toLowerCase();
      if (LOCALE_SET.has(tag)) return tag as Locale;
    }
  }

  return defaultLocale;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Share-link handler — /?go=<path>  /?go=:lang/<path>
  if (pathname === '/') {
    const go = req.nextUrl.searchParams.get('go');
    if (go !== null) {
      const raw = go.startsWith('/') ? go : `/${go}`;

      // :lang placeholder → swap in the detected locale
      if (raw === '/:lang' || raw.startsWith('/:lang/')) {
        const locale = detectLocale(req);
        return NextResponse.redirect(new URL(`/${locale}${raw.slice(6)}`, req.url));
      }

      // path already has a valid locale prefix → redirect as-is, no detection needed
      if (LOCALE_PREFIX_RE.test(raw)) {
        return NextResponse.redirect(new URL(raw, req.url));
      }

      // no locale → detect and prepend
      const locale = detectLocale(req);
      return NextResponse.redirect(new URL(`/${locale}${raw === '/' ? '' : raw}`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*|~test).*)'],
};
