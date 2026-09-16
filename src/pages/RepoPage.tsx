import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { githubApi } from '../services/github';
import { RepoHeader } from '../components/RepoHeader';
import { FileExplorer } from '../components/FileExplorer';
import { FileViewer } from '../components/FileViewer';
import { ReadmeViewer } from '../components/ReadmeViewer';
import { Loader2, AlertCircle, CircleDot, GitCommit } from 'lucide-react';
import { ContentItem } from '../types/github';

export const RepoPage: React.FC = () => {
  const { owner = '', repo = '', '*': path = '' } = useParams();
  const location = useLocation();

  const isBlobView = location.pathname.includes('/blob/');
  const isIssuesView = location.pathname.endsWith('/issues');
  const isCommitsView = location.pathname.endsWith('/commits');

  const { data: repoData, isLoading: isRepoLoading, error: repoError } = useQuery({
    queryKey: ['repo', owner, repo],
    queryFn: () => githubApi.getRepoDetails(owner, repo),
  });

  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const { data: branchData } = useQuery({
    queryKey: ['branches', owner, repo],
    queryFn: () => githubApi.getBranches(owner, repo),
    enabled: !!repoData,
  });

  useEffect(() => {
    if (repoData && !selectedBranch) {
      setSelectedBranch(repoData.default_branch);
    }
  }, [repoData, selectedBranch]);

  const targetPath = path.split('/').slice(1).join('/');

  const { data: contentsData, isLoading: isContentsLoading } = useQuery({
    queryKey: ['contents', owner, repo, targetPath, selectedBranch],
    queryFn: () => githubApi.getContents(owner, repo, targetPath, selectedBranch),
    enabled: !!selectedBranch && !isIssuesView && !isCommitsView,
  });

  const { data: readmeData } = useQuery({
    queryKey: ['readme', owner, repo, selectedBranch],
    queryFn: () => githubApi.getReadme(owner, repo, selectedBranch),
    enabled: !!selectedBranch && !targetPath && !isIssuesView && !isCommitsView,
  });

  const { data: issuesData, isLoading: isIssuesLoading } = useQuery({
    queryKey: ['issues', owner, repo],
    queryFn: () => githubApi.getIssues(owner, repo),
    enabled: isIssuesView,
  });

  const { data: commitsData, isLoading: isCommitsLoading } = useQuery({
    queryKey: ['commits', owner, repo, selectedBranch],
    queryFn: () => githubApi.getCommits(owner, repo, selectedBranch),
    enabled: isCommitsView && !!selectedBranch,
  });

  if (isRepoLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  if (repoError || !repoData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-md text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(repoError as Error)?.message || 'Repository not found'}</span>
        </div>
      </div>
    );
  }

  const branches = branchData ? branchData.map((b) => b.name) : [repoData.default_branch];

  return (
    <div>
      <RepoHeader
        repo={repoData}
        selectedBranch={selectedBranch || repoData.default_branch}
        branches={branches}
        onBranchChange={(b) => setSelectedBranch(b)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {isIssuesView && (
          <div className="border border-border-default rounded-md bg-canvas-subtle divide-y divide-border-subtle">
            <div className="px-4 py-3 bg-canvas-default font-semibold text-xs text-gray-300">
              Open Issues
            </div>
            {isIssuesLoading ? (
              <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-accent-blue" /></div>
            ) : issuesData?.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">No open issues found.</div>
            ) : (
              issuesData?.map((issue) => (
                <div key={issue.id} className="p-4 flex items-start gap-3 hover:bg-canvas-default transition">
                  <CircleDot className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                  <div>
                    <a href={issue.html_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-gray-200 hover:text-accent-blue">
                      {issue.title}
                    </a>
                    <div className="text-xs text-gray-500 mt-1">
                      #{issue.number} opened by {issue.user.login}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {isCommitsView && (
          <div className="border border-border-default rounded-md bg-canvas-subtle divide-y divide-border-subtle">
            <div className="px-4 py-3 bg-canvas-default font-semibold text-xs text-gray-300">
              Commit History ({selectedBranch})
            </div>
            {isCommitsLoading ? (
              <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-accent-blue" /></div>
            ) : (
              commitsData?.map((c) => (
                <div key={c.sha} className="p-4 flex items-start justify-between gap-4 hover:bg-canvas-default transition">
                  <div className="flex items-start gap-3">
                    <GitCommit className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-200">{c.commit.message}</div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {c.commit.author.name} committed on {new Date(c.commit.author.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-accent-blue bg-canvas-default px-2 py-0.5 border border-border-default rounded">
                    {c.sha.slice(0, 7)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {!isIssuesView && !isCommitsView && (
          <>
            {isContentsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
              </div>
            ) : isBlobView && contentsData && !Array.isArray(contentsData) ? (
              <FileViewer file={contentsData as ContentItem} />
            ) : Array.isArray(contentsData) ? (
              <>
                <FileExplorer
                  items={contentsData}
                  owner={owner}
                  repo={repo}
                  currentPath={targetPath}
                  branch={selectedBranch}
                />
                {!targetPath && readmeData && <ReadmeViewer content={readmeData} />}
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
};