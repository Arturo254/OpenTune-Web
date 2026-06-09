'use client';

import { useTranslations } from 'next-intl';
import {
  Music2,
  Palette,
  Settings,
  Search,
  Volume2,
  Plus,
  RefreshCw,
  Wrench,
  Folder,
  Languages,
  ArrowUpCircle,
  Headphones,
} from '@icons';
import type { IconProps } from '@icon/_types';

interface Feature {
  icon: React.ComponentType<IconProps>;
  titleKey: string;
  descKey: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

const FEATURES: Feature[] = [
  { icon: Music2, titleKey: 'features.yt_title', descKey: 'features.yt_desc', color: 'primary' },
  {
    icon: Palette,
    titleKey: 'features.design_title',
    descKey: 'features.design_desc',
    color: 'secondary',
  },
  { icon: Settings, titleKey: 'features.ui_title', descKey: 'features.ui_desc', color: 'tertiary' },
  {
    icon: Search,
    titleKey: 'features.explore_title',
    descKey: 'features.explore_desc',
    color: 'primary',
  },
  {
    icon: Volume2,
    titleKey: 'features.quality_title',
    descKey: 'features.quality_desc',
    color: 'secondary',
  },
  {
    icon: Plus,
    titleKey: 'features.playlist_title',
    descKey: 'features.playlist_desc',
    color: 'tertiary',
  },
  {
    icon: RefreshCw,
    titleKey: 'features.sync_title',
    descKey: 'features.sync_desc',
    color: 'primary',
  },
  {
    icon: Wrench,
    titleKey: 'features.advanced_title',
    descKey: 'features.advanced_desc',
    color: 'secondary',
  },
  {
    icon: Folder,
    titleKey: 'features.library_title',
    descKey: 'features.library_desc',
    color: 'tertiary',
  },
  {
    icon: Languages,
    titleKey: 'features.multilang_title',
    descKey: 'features.multilang_desc',
    color: 'primary',
  },
  {
    icon: ArrowUpCircle,
    titleKey: 'features.updates_title',
    descKey: 'features.updates_desc',
    color: 'secondary',
  },
  {
    icon: Headphones,
    titleKey: 'features.ux_title',
    descKey: 'features.ux_desc',
    color: 'tertiary',
  },
];

const colorMap = {
  primary: { wrap: 'bg-[#d0bcff]/30 text-[#e9ddff]' },
  secondary: { wrap: 'bg-[#4a4359]/60 text-[#ccc2dc]' },
  tertiary: { wrap: 'bg-[#efb8c8]/30 text-[#ffd9e3]' },
};

export default function Features() {
  const t = useTranslations();

  return (
    <section id="features" className="px-6 py-24 bg-[#0e0e11]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] mb-4 font-epilogue">
            {t('features.title')}
          </h2>
          <p className="text-[#cac4d0] max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.titleKey}
              className="glass-card p-6 rounded-2xl hover:bg-[#2b292d] transition-colors"
            >
              <div className={`feature-icon-wrap ${colorMap[f.color].wrap}`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-[#e5e1e7] font-medium text-base mb-2">
                {t(f.titleKey as Parameters<typeof t>[0])}
              </h3>
              <p className="text-[#cac4d0] text-sm leading-relaxed">
                {t(f.descKey as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
