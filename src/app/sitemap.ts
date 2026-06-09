import { MetadataRoute } from 'next';
import { locales } from '@config/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://opentune.app';
  const routes = ['', '/contributors', '/support'];

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
