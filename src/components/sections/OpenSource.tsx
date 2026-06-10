'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Code, Users, Star, GitBranch, ExternalLink, ArrowRight } from '@icons';
import { fetchRepo, REPOS } from '@lib/github';
import type { GitHubRepo } from '@t/github';
import { EXTERNAL_LINKS } from '@config/links';

export default function OpenSource() {
  const t = useTranslations();
  const [repo, setRepo] = useState<GitHubRepo | null>(null);

  useEffect(() => {
    fetchRepo(REPOS.android).then(setRepo);
  }, []);

  return (
    <section className="px-6 py-24 bg-[#0e0e11]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#d0bcff]/10 text-[#d0bcff] px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <Users size={16} />
            {t('oss.badge')}
          </div>

          <h2 className="text-[45px] leading-[52px] font-bold text-[#e9ddff] font-epilogue">
            {t('oss.title')}
          </h2>
          <p className="text-[#cac4d0] text-lg leading-relaxed max-w-xl">
            {t('oss.body')}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-[#e9ddff] font-epilogue">
                {repo ? repo.stargazers_count : '...'}
              </div>
              <div className="flex items-center gap-2 text-[#cac4d0] text-sm">
                <Star size={16} className="text-[#ffd9e3]" />
                {t('contributors.stat_stars')}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-[#e9ddff] font-epilogue">
                {repo ? repo.forks_count : '...'}
              </div>
              <div className="flex items-center gap-2 text-[#cac4d0] text-sm">
                <GitBranch size={16} className="text-[#d0bcff]" />
                {t('contributors.stat_forks')}
              </div>
            </div>
          </div>

          <div className="pt-8">
            <a
              href={EXTERNAL_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#2b292d] text-[#e5e1e7] px-8 py-4 rounded-full text-sm font-medium border border-[#49454f]/30 hover:bg-[#353438] transition-all no-underline"
            >
              <Code size={20} />
              {t('oss.star')}
              <ExternalLink size={18} className="opacity-50" />
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full lg:max-w-md">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-8 ambient-glow">
            <div className="flex items-center gap-4">
              <Image
                src={EXTERNAL_LINKS.AVATAR_GITHUB}
                alt="Main Developer"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-[#d0bcff]/20"
              />
              <div>
                <div className="text-[#e9ddff] font-medium font-epilogue">
                  Arturo
                </div>
                <div className="text-[#cac4d0] text-xs">@Arturo254</div>
              </div>
            </div>

            <div className="p-6 bg-[#1c1b1f] rounded-2xl border border-white/5">
              <div className="text-[#d0bcff] text-sm font-medium mb-2 uppercase tracking-widest text-[10px]">
                {t('oss.latest_version')}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#e9ddff] font-bold text-xl">v1.2.0-stable</span>
                <span className="bg-[#4a4359] text-[#e9ddff] px-3 py-1 rounded-full text-[10px] font-bold">
                  Android
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[#cac4d0] text-sm italic">
                &ldquo;Music is the universal language of mankind.&rdquo;
              </div>
              <div className="pt-2">
                <a
                  href={`${EXTERNAL_LINKS.GITHUB_REPO}/graphs/contributors`}
                  className="flex items-center justify-between text-[#d0bcff] text-sm font-medium hover:translate-x-1 transition-transform"
                >
                  {t('contributors.view_all')}
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
