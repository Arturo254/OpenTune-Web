'use client';

import { useTranslations } from 'next-intl';
import {
  Users,
  Code,
  Globe,
  HandHeart,
  GitCommitHorizontal,
  ExternalLink,
  ArrowRight,
} from '@icons';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  REPOS,
  fetchContributors,
  fetchRecentCommits,
  fetchRepo,
  fetchTotalCommits,
  getContributorRole,
} from '@lib/github';
import type { GitHubContributor, GitHubCommit, GitHubRepo } from '@t/github';
import MobileBottomNav from '@ui/MobileBottomNav';
import type { Locale } from '@config/locales';
import { EXTERNAL_LINKS, PATHS } from '@config/links';

const helpItems = [
  {
    title: 'contributors.help_code_title',
    desc: 'contributors.help_code_desc',
    icon: Code,
    cta: 'contributors.help_code_cta',
    href: `${EXTERNAL_LINKS.GITHUB_REPO}/issues`,
  },
  {
    title: 'contributors.help_report_title',
    desc: 'contributors.help_report_desc',
    icon: Globe,
    cta: 'contributors.help_report_cta',
    href: `${EXTERNAL_LINKS.GITHUB_REPO}/issues/new`,
  },
  {
    title: 'contributors.help_translate_title',
    desc: 'contributors.help_translate_desc',
    icon: Globe,
    cta: 'contributors.help_translate_cta',
    href: null,
  },
  {
    title: 'contributors.help_donate_title',
    desc: 'contributors.help_donate_desc',
    icon: HandHeart,
    cta: 'contributors.help_donate_cta',
    href: null,
  },
];

export default function ContributorsClient({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [totalCommits, setTotalCommits] = useState('...');
  const [loadingContribs, setLoadingContribs] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [repoData, commitsCount, contribsData] = await Promise.all([
          fetchRepo(REPOS.android),
          fetchTotalCommits(REPOS.android),
          fetchContributors(REPOS.android),
        ]);

        setRepo(repoData);
        setTotalCommits(commitsCount);
        setContributors(contribsData.slice(0, 9));
        setLoadingContribs(false);

        const commitsData = await fetchRecentCommits(REPOS.android);
        setCommits(commitsData);
        setLoadingCommits(false);
      } catch (error) {
        console.error('Error fetching contributors data:', error);
        setLoadingContribs(false);
        setLoadingCommits(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#141317] pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-32 space-y-24">
        {/* Hero Section */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#d0bcff]/10 text-[#d0bcff] px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <Users size={16} />
            {t('contributors.badge')}
          </div>
          <h1 className="text-[57px] leading-[64px] font-bold text-[#e5e1e7] font-epilogue">
            {t('contributors.title')}
          </h1>
          <p className="text-[#cac4d0] text-xl leading-relaxed">{t('contributors.subtitle')}</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'contributors.stat_contributors', value: contributors.length || '...' },
            { label: 'contributors.stat_commits', value: totalCommits },
            { label: 'contributors.stat_stars', value: repo?.stargazers_count ?? '...' },
            { label: 'contributors.stat_forks', value: repo?.forks_count ?? '...' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1c1b1f] p-6 rounded-[2rem] border border-white/5 text-center"
            >
              <div className="text-3xl font-bold text-[#d0bcff] font-epilogue mb-1">
                {stat.value}
              </div>
              <div className="text-[#cac4d0] text-xs font-medium uppercase tracking-widest">
                {t(stat.label)}
              </div>
            </div>
          ))}
        </section>

        {/* Top Contributors */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] leading-10 font-semibold text-[#e5e1e7] font-epilogue">
              {t('contributors.top_title')}
            </h2>
            <a
              href={EXTERNAL_LINKS.CONTRIBUTORS_GRAPH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d0bcff] text-sm font-medium flex items-center gap-1 hover:underline"
            >
              {t('contributors.view_all')}
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingContribs
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-[#1c1b1f] p-4 rounded-2xl flex items-center gap-4 border border-white/5"
                  >
                    <div className="skeleton-shimmer w-16 h-16 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton-shimmer h-5 w-32 rounded" />
                      <div className="skeleton-shimmer h-3 w-20 rounded" />
                      <div className="skeleton-shimmer h-4 w-24 rounded" />
                    </div>
                  </div>
                ))
              : contributors.slice(0, 9).map((c) => {
                  const role = getContributorRole(c.contributions, c.login);
                  return (
                    <div
                      key={c.login}
                      className="group relative bg-[#1c1b1f] p-4 rounded-2xl flex items-center gap-4 border border-white/5
                    hover:bg-[#2b2931] hover:border-[#d0bcff]/40 hover:shadow-[0_0_24px_rgba(208,188,255,0.12)]
                    hover:scale-[1.03] transition-all duration-200 cursor-default"
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          src={`${c.avatar_url}&s=64`}
                          alt={c.login}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent
                        group-hover:ring-[#d0bcff]/60 transition-all duration-200"
                          unoptimized
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      shadow-[0_0_14px_4px_rgba(208,188,255,0.25)]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-[#e9ddff] font-medium text-base group-hover:text-[#d0bcff] transition-colors truncate">
                            {c.login}
                          </h3>
                          <span className="text-[#cac4d0] text-[11px] font-medium bg-[#2b292d] group-hover:bg-[#3d3547] px-2 py-1 rounded-full transition-colors whitespace-nowrap">
                            {c.contributions} {t('contributors.commits_label')}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="bg-[#e9ddff]/10 group-hover:bg-[#d0bcff]/20 text-[#d0bcff] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">
                            {role}
                          </span>
                        </div>
                      </div>
                      <a
                        href={c.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={18} className="text-[#cac4d0] hover:text-[#e9ddff]" />
                      </a>
                    </div>
                  );
                })}
          </div>
        </section>

        {/* Bento: How to Help + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* How to Help */}
          <div className="lg:col-span-2 bg-[#2b292d] rounded-[3rem] p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9ddff]/10 blur-[100px] -mr-32 -mt-32" />
            <div>
              <h2 className="text-[32px] leading-10 font-semibold text-[#e9ddff] mb-2 font-epilogue">
                {t('contributors.how_title')}
              </h2>
              <p className="text-sm text-[#cac4d0]">{t('contributors.how_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpItems.map((item) => (
                <div key={item.title} className="space-y-3">
                  <div className="flex items-center gap-3 text-[#e9ddff]">
                    <item.icon size={20} />
                    <span className="font-medium text-base">{t(item.title)}</span>
                  </div>
                  <p className="text-sm text-[#cac4d0]">{t(item.desc)}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#e9ddff] text-[#37265e] px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform no-underline"
                    >
                      {t(item.cta)}
                    </a>
                  ) : (
                    <button className="bg-[#4a4359] text-[#bab1ca] px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform">
                      {t(item.cta)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Latest Activity */}
          <div className="bg-[#1c1b1f] rounded-[3rem] p-6 border border-white/5 space-y-6">
            <h2 className="text-[28px] leading-9 font-semibold text-[#e9ddff] font-epilogue">
              {t('contributors.activity_title')}
            </h2>
            <div className="space-y-6">
              {loadingCommits ? (
                <div className="flex justify-center py-8">
                  <div className="circular-progress" />
                </div>
              ) : (
                commits.map((commit) => (
                  <div key={commit.sha} className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-[#e9ddff]/20 p-2 rounded-full">
                        <GitCommitHorizontal size={20} className="text-[#e9ddff]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[#e5e1e7] font-medium text-base">
                        {commit.commit.message.split('\n')[0]?.substring(0, 60) ?? ''}
                      </p>
                      <p className="text-[11px] font-medium text-[#cac4d0]">
                        by{' '}
                        <span className="text-[#d0bcff]">
                          {commit.author?.login ?? commit.commit.author.name}
                        </span>
                        {' • '}
                        {new Date(commit.commit.author.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <a
              href={EXTERNAL_LINKS.COMMITS_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center border border-[#49454f] text-[#cac4d0] py-3 rounded-full text-sm font-medium hover:bg-white/5 transition-colors no-underline"
            >
              {t('contributors.activity_link')}
            </a>
          </div>
        </section>
      </div>

      <MobileBottomNav
        homeHref={`/${locale}${PATHS.HOME}`}
        homeLabel={t('common.home')}
        activeIcon={Users}
        activeLabel={t('common.community')}
      />
    </div>
  );
}
