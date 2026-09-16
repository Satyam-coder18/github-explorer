import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, GitFork, AlertCircle, Loader2 } from 'lucide-react';
import { githubApi } from '../services/github';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => githubApi.searchRepos(query),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          {query ? `Search results for "${query}"` : 'Popular Repositories'}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Explore codebases from GitHub's public developer network.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-md text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.items.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-canvas-subtle border border-border-default rounded-md flex flex-col justify-between hover:border-gray-500 transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-5 h-5 rounded-full" />
                  <Link to={`/${repo.owner.login}/${repo.name}`} className="text-sm font-semibold text-accent-blue hover:underline truncate">
                    {repo.full_name}
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono pt-2 border-t border-border-subtle">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent-yellow" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks_count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};