import { NextResponse } from 'next/server';
import { EXTERNAL_LINKS } from '@config/links';
import { REPOS, fetchWithTimeout } from '@lib/github';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPerPage = searchParams.get('per_page');
  const parsedPerPage = parseInt(rawPerPage || '20', 10);
  const perPage = isNaN(parsedPerPage) ? 20 : Math.min(Math.max(parsedPerPage, 1), 100);

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const res = await fetchWithTimeout(`${EXTERNAL_LINKS.GITHUB_API}/${REPOS.android}/releases?per_page=${perPage}`, {
      headers,
      next: { revalidate: 3600 },
      timeoutMs: 5000,
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch ($error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
