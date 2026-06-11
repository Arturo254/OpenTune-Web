import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@config/locales';
import { DOMAIN, PATHS } from '@config/links';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = DOMAIN;
  const routes = ['', PATHS.CONTRIBUTORS, PATHS.SUPPORT];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const languages: Record<string, string> = {};
    locales.forEach((l) => {
      languages[l] = `${baseUrl}/${l}${route}`;
    });
    languages['x-default'] = `${baseUrl}/${defaultLocale}${route}`;

    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${route}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  return sitemapEntries;
}
