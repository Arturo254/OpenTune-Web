import type { GitHubRelease, GitHubContributor, GitHubCommit, GitHubRepo } from '@t/github';

const GITHUB_API = 'https://api.github.com/repos';

export const REPOS = {
  android: 'Arturo254/OpenTune',
} as const;

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }
  return num.toString();
}

export async function fetchLatestRelease(repo: string): Promise<GitHubRelease | null> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/releases/latest`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return null;
    }
    return res.json() as Promise<GitHubRelease>;
  } catch {
    return null;
  }
}

export async function fetchAllReleases(repo: string): Promise<GitHubRelease[]> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/releases?per_page=20`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return [];
    }
    return res.json() as Promise<GitHubRelease[]>;
  } catch {
    return [];
  }
}

export async function fetchRepo(repo: string): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return null;
    }
    return res.json() as Promise<GitHubRepo>;
  } catch {
    return null;
  }
}

export async function fetchContributors(repo: string): Promise<GitHubContributor[]> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/contributors?per_page=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return [];
    }
    return res.json() as Promise<GitHubContributor[]>;
  } catch {
    return [];
  }
}

export async function fetchRecentCommits(repo: string, count = 4): Promise<GitHubCommit[]> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/commits?per_page=${count}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return [];
    }
    return res.json() as Promise<GitHubCommit[]>;
  } catch {
    return [];
  }
}

export async function fetchTotalCommits(repo: string): Promise<string> {
  try {
    const res = await fetch(`${GITHUB_API}/${repo}/commits?per_page=1`, {
      next: { revalidate: 3600 },
    });
    const link = res.headers.get('Link');
    if (link) {
      const match = link.match(/page=(\d+)>; rel="last"/);
      if (match?.[1]) {
        return formatNumber(parseInt(match[1], 10));
      }
    }
    return 'N/A';
  } catch {
    return 'N/A';
  }
}

export function getContributorRole(contributions: number, login: string): string {
  if (login === 'Arturo254') {
    return 'Lead Developer';
  }
  if (contributions > 100) {
    return 'Core Contributor';
  }
  if (contributions > 30) {
    return 'Major Contributor';
  }
  if (contributions > 10) {
    return 'Contributor';
  }
  return 'Supporter';
}

export function buildDownloadUrl(repo: string, version: string): string {
  return `https://github.com/${repo}/releases/download/${version}/app-universal-release.apk`;
}
