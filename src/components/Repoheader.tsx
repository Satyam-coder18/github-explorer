import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, GitFork, Code, CircleDot, History, ExternalLink } from 'lucide-react';
import { Repository } from '../types/github';

interface Props {
  repo: Repository;
  selectedBranch: string;
  branches: string[];
  onBranchChange: (branch: string) => void;
}

export const RepoHeader: React.FC<Props> = ({ repo, selectedBranch, branches, onBranchChange }) => {
  const location = useLocation();
  const basePath = `/${repo.owner.login}/${repo.name}`;

  const isActive = (path: string) => {
    if (path === basePath) {
      return location.pathname === basePath || location.pathname.startsWith(`${basePath}/tree`) || location.pathname.startsWith(`${basePath}/blob`);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-canvas-subtle border-b border-border-default pt-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-8 h-8 rounded-full border border-border-default" />
            <h1 className="text-xl font-normal text-gray-200">
              <Link to={`/?q=${repo.owner.login}`} className="text-accent-blue hover:underline">{repo.owner.login}</Link>
              <span className="mx-1 text-gray-500">/</span>
              <Link to={basePath} className="text-accent-blue font-semibold hover:underline">{repo.name}</Link>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full border border-border-default text-gray-400">Public</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-canvas-default border border-border-default rounded-md text-xs">
              <span className="px-2 py-1 flex items-center gap-1 text-gray-300 border-r border-border-default">
                <Star className="w-3.5 h-3.5 text-accent-yellow" /> Star
              </span>
              <span className="px-2 py-1 font-mono text-gray-400">{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center bg-canvas-default border border-border-default rounded-md text-xs">
              <span className="px-2 py-1 flex items-center gap-1 text-gray-300 border-r border-border-default">
                <GitFork className="w-3.5 h-3.5 text-gray-400" /> Fork
              </span>
              <span className="px-2 py-1 font-mono text-gray-400">{repo.forks_count.toLocaleString()}</span>
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2 py-1 bg-canvas-default border border-border-default rounded-md text-xs text-gray-300 hover:bg-border-subtle"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="branch-select" className="text-xs text-gray-400">Branch:</label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="bg-canvas-default border border-border-default rounded-md px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-accent-blue"
            >
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto">
            <Link
              to={basePath}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition ${
                isActive(basePath) && !location.pathname.includes('/issues') && !location.pathname.includes('/commits')
                  ? 'border-accent-blue text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Code className="w-4 h-4" /> Code
            </Link>
            <Link
              to={`${basePath}/issues`}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition ${
                isActive(`${basePath}/issues`)
                  ? 'border-accent-blue text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <CircleDot className="w-4 h-4" /> Issues ({repo.open_issues_count})
            </Link>
            <Link
              to={`${basePath}/commits`}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition ${
                isActive(`${basePath}/commits`)
                  ? 'border-accent-blue text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <History className="w-4 h-4" /> Commits
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};