import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { locales, defaultLocale, type Locale } from '@config/locales';

const intlMiddleware = createMiddleware(routing);

/**
 * Detect the user's preferred locale:
 *  1. NEXT_LOCALE cookie (set by next-intl on first visit / language switch)
 *  2. Accept-Language header
 *  3. Site default
 */
function detectLocale(req: NextRequest): Locale {
  // 1. Cookie
  const cookie = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }

  // 2. Accept-Language header  e.g. "es-MX,es;q=0.9,en;q=0.8"
  const acceptLang = req.headers.get('accept-language') ?? '';
  for (const segment of acceptLang.split(',')) {
    const tag = segment.split(';')[0]?.trim().split('-')[0]?.toLowerCase() ?? '';
    if ((locales as readonly string[]).includes(tag)) {
      return tag as Locale;
    }
  }

  // 3. Default
  return defaultLocale;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Share-link handler
  // Matches:  /?go=/contributors  /?go=contributors  /?go=/support/123  etc.
  if (pathname === '/') {
    const go = req.nextUrl.searchParams.get('go');
    if (go !== null) {
      const locale = detectLocale(req);

      // Normalise: ensure leading slash
      let path = go.startsWith('/') ? go : `/${go}`;

      // Strip a locale prefix someone may have included in the `go` value
      // e.g.  go=/en/contributors → /contributors
      for (const loc of locales) {
        if (path === `/${loc}`) { path = '/'; break; }
        if (path.startsWith(`/${loc}/`)) { path = path.slice(loc.length + 1) || '/'; break; }
      }

      // Build target URL:  /en  or  /en/contributors  etc.
      const target = path === '/' ? `/${locale}` : `/${locale}${path}`;
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
