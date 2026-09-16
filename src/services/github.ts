import { Repository, ContentItem, Branch, Issue, Commit } from '../types/github';

const BASE_URL = 'https://api.github.com';

export class GitHubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new GitHubApiError(403, 'GitHub API rate limit exceeded.');
    }
    if (res.status === 404) {
      throw new GitHubApiError(404, 'Requested repository or file path was not found.');
    }
    throw new GitHubApiError(res.status, `GitHub API Error (${res.status})`);
  }

  return res.json();
}

export const githubApi = {
  searchRepos: async (query: string, sort = 'stars') => {
    const q = query.trim() ? encodeURIComponent(query.trim()) : 'stars:>50000';
    return fetchGitHub<{ items: Repository[] }>(`/search/repositories?q=${q}&sort=${sort}&order=desc&per_page=20`);
  },

  getRepoDetails: (owner: string, repo: string) =>
    fetchGitHub<Repository>(`/repos/${owner}/${repo}`),

  getContents: (owner: string, repo: string, path = '', ref?: string) => {
    const cleanPath = path ? `/${path}` : '';
    const refParam = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    return fetchGitHub<ContentItem[] | ContentItem>(`/repos/${owner}/${repo}/contents${cleanPath}${refParam}`);
  },

  getBranches: (owner: string, repo: string) =>
    fetchGitHub<Branch[]>(`/repos/${owner}/${repo}/branches?per_page=100`),

  getIssues: (owner: string, repo: string) =>
    fetchGitHub<Issue[]>(`/repos/${owner}/${repo}/issues?state=open&per_page=20`),

  getCommits: (owner: string, repo: string, ref?: string) => {
    const refParam = ref ? `?sha=${encodeURIComponent(ref)}` : '';
    return fetchGitHub<Commit[]>(`/repos/${owner}/${repo}/commits${refParam}`);
  },

  getReadme: async (owner: string, repo: string, ref?: string) => {
    const refParam = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    try {
      const data = await fetchGitHub<{ content: string; encoding: string }>(`/repos/${owner}/${repo}/readme${refParam}`);
      if (data.encoding === 'base64' && data.content) {
        return atob(data.content.replace(/\n/g, ''));
      }
      return '';
    } catch (e) {
      return null;
    }
  }
};