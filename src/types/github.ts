export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string | null;
  prerelease: boolean;
  assets: Array<{ browser_download_url: string }>;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: { login: string } | null;
}

export interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}
