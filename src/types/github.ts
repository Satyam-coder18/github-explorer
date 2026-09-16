export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  topics?: string[];
  license?: {
    name: string;
    spdx_id: string;
  } | null;
  updated_at: string;
  pushed_at: string;
  size: number;
}

export interface ContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  content?: string;
  encoding?: string;
}

export interface Branch {
  name: string;
  commit: { sha: string; url: string };
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  user: { login: string; avatar_url: string };
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  html_url: string;
  labels: { id: number; name: string; color: string }[];
  pull_request?: object;
}

export interface Commit {
  sha: string;
  commit: {
    author: { name: string; date: string };
    message: string;
  };
  author: { login: string; avatar_url: string } | null;
  html_url: string;
}