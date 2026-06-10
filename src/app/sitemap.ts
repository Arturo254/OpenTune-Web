import { MetadataRoute } from 'next';
import { locales } from '@config/locales';
import { DOMAIN, PATHS } from '@config/links';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = DOMAIN;
  const routes = ['', PATHS.CONTRIBUTORS, PATHS.SUPPORT];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
