import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  content: string;
}

export const ReadmeViewer: React.FC<Props> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="border border-border-default rounded-md bg-canvas-subtle overflow-hidden mt-6">
      <div className="px-4 py-2.5 bg-canvas-default border-b border-border-default flex items-center gap-2 text-xs font-semibold text-gray-300">
        <BookOpen className="w-4 h-4 text-gray-400" />
        README.md
      </div>
      <pre className="p-6 text-xs font-mono leading-relaxed text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {content}
      </pre>
    </div>
  );
};