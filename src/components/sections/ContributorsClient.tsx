'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Heart,
  Star,
  GitFork,
  OctagonAlert,
  ArrowRight,
  ExternalLink,
  FileCode,
  Palette,
  Languages,
  Users,
  History,
  Bug,
  GitCommitHorizontal,
  Code,
} from '@icons';
import MobileBottomNav from '@ui/MobileBottomNav';
import { type Locale } from '@config/locales';
import { formatNumber, getContributorRole, REPOS } from '@lib/github';
import type { GitHubContributor, GitHubCommit, GitHubRepo } from '@t/github';

interface Stats {
  stars: string;
  forks: string;
  issues: string;
  commits: string;
}

export default function ContributorsClient({ locale }: { locale: Locale }) {
  const t = useTranslations();

  const [stats, setStats] = useState<Stats>({ stars: '—', forks: '—', issues: '—', commits: '—' });
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loadingContribs, setLoadingContribs] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [repoRes, commitsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${REPOS.android}`),
          fetch(`https://api.github.com/repos/${REPOS.android}/commits?per_page=1`),
        ]);
        const data = (await repoRes.json()) as GitHubRepo;
        const link = commitsRes.headers.get('Link');
        let totalCommits = '—';
        if (link) {
          const match = link.match(/page=(\d+)>; rel="last"/);
          if (match?.[1]) {
            totalCommits = formatNumber(parseInt(match[1]!, 10));
          }
        }
        setStats({
          stars: formatNumber(data.stargazers_count),
          forks: formatNumber(data.forks_count),
          issues: formatNumber(data.open_issues_count),
          commits: totalCommits,
        });
      } catch {
        /* silently fail */
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${REPOS.android}/contributors?per_page=9`,
        );
        const data = (await res.json()) as GitHubContributor[];
        setContributors(data);
      } catch {
        /* silently fail */
      } finally {
        setLoadingContribs(false);
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${REPOS.android}/commits?per_page=4`);
        const data = (await res.json()) as GitHubCommit[];
        setCommits(data);
      } catch {
        /* silently fail */
      } finally {
        setLoadingCommits(false);
      }
    })();
  }, []);

  const statsData = [
    { id: 'stars', icon: Star, label: t('contributors.stars'), value: stats.stars },
    { id: 'forks', icon: GitFork, label: t('contributors.forks'), value: stats.forks },
    { id: 'issues', icon: OctagonAlert, label: t('contributors.issues'), value: stats.issues },
    { id: 'commits', icon: History, label: t('contributors.commits'), value: stats.commits },
  ];

  type HelpItem = {
    icon: typeof FileCode;
    title: Parameters<typeof t>[0];
    desc: Parameters<typeof t>[0];
    cta: Parameters<typeof t>[0];
    href?: string;
  };

  const helpItems: HelpItem[] = [
    {
      icon: Code,
      title: 'contributors.code_title',
      desc: 'contributors.code_desc',
      cta: 'contributors.code_cta',
      href: `https://github.com/${REPOS.android}/issues`,
    },
    {
      icon: Palette,
      title: 'contributors.design_title',
      desc: 'contributors.design_desc',
      cta: 'contributors.design_cta',
    },
    {
      icon: Languages,
      title: 'contributors.translate_title',
      desc: 'contributors.translate_desc',
      cta: 'contributors.translate_cta',
    },
    {
      icon: Bug,
      title: 'contributors.bugs_title',
      desc: 'contributors.bugs_desc',
      cta: 'contributors.bugs_cta',
      href: `https://github.com/${REPOS.android}/issues/new`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#141317] text-[#e5e1e7] pb-32 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 space-y-16 w-full">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#4a4359] text-[#bab1ca] px-4 py-1 rounded-full text-[11px] font-medium">
            <Heart size={16} fill="currentColor" />
            {t('contributors.badge')}
          </div>
          <h1 className="text-[48px] md:text-[57px] leading-[56px] md:leading-[64px] tracking-[-0.25px] font-bold text-[#e9ddff] font-epilogue">
            {t('contributors.title')}
          </h1>
          <p className="text-base text-[#cac4d0] max-w-2xl mx-auto">{t('contributors.subtitle')}</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((s) => (
            <div
              key={s.id}
              className="bg-[#2b292d] p-6 rounded-2xl ambient-glow border border-white/5 flex flex-col items-center text-center gap-2"
            >
              <s.icon size={30} className="text-[#d0bcff]" />
              <span className="text-[28px] leading-9 font-semibold text-[#e9ddff] font-epilogue">
                {s.value}
              </span>
              <span className="text-sm font-medium text-[#cac4d0]">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Contributors Grid */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-[32px] leading-10 font-semibold text-[#e9ddff] font-epilogue">
              {t('contributors.section_title')}
            </h2>
            <a
              href="https://github.com/Arturo254/OpenTune/graphs/contributors"
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
              : contributors.map((c) => {
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
              href="https://github.com/Arturo254/OpenTune/commits/main"
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
        homeHref={`/${locale}`}
        homeLabel={t('common.home')}
        activeIcon={Users}
        activeLabel={t('common.community')}
      />
    </div>
  );
}
