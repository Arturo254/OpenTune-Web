import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'flagicons.lipis.dev' },
      { protocol: 'https', hostname: 'flowbite.s3.amazonaws.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
