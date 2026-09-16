import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, FileText, CornerLeftUp } from 'lucide-react';
import { ContentItem } from '../types/github';

interface Props {
  items: ContentItem[];
  owner: string;
  repo: string;
  currentPath: string;
  branch: string;
}

export const FileExplorer: React.FC<Props> = ({ items, owner, repo, currentPath, branch }) => {
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });

  const getParentPath = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    return parts.join('/');
  };

  const parentPath = getParentPath();

  return (
    <div className="border border-border-default rounded-md bg-canvas-subtle overflow-hidden">
      <div className="px-4 py-2.5 bg-canvas-default border-b border-border-default text-xs text-gray-400 font-mono">
        path: /{currentPath}
      </div>
      <div className="divide-y divide-border-subtle">
        {currentPath && (
          <div className="px-4 py-2 flex items-center gap-2 text-xs hover:bg-canvas-default transition">
            <CornerLeftUp className="w-4 h-4 text-gray-400" />
            <Link
              to={parentPath ? `/${owner}/${repo}/tree/${branch}/${parentPath}` : `/${owner}/${repo}`}
              className="text-accent-blue hover:underline font-mono"
            >
              ..
            </Link>
          </div>
        )}
        {sortedItems.map((item) => {
          const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
          const targetUrl = item.type === 'dir'
            ? `/${owner}/${repo}/tree/${branch}/${itemPath}`
            : `/${owner}/${repo}/blob/${branch}/${itemPath}`;

          return (
            <div key={item.sha} className="px-4 py-2 flex items-center justify-between text-xs hover:bg-canvas-default transition">
              <div className="flex items-center gap-2 min-w-0">
                {item.type === 'dir' ? (
                  <Folder className="w-4 h-4 text-accent-blue shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <Link to={targetUrl} className="text-gray-200 hover:text-accent-blue truncate font-mono">
                  {item.name}
                </Link>
              </div>
              <span className="text-gray-500 font-mono text-[11px]">
                {item.type === 'file' ? `${(item.size / 1024).toFixed(1)} KB` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};