import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { ContentItem } from '../types/github';

interface Props {
  file: ContentItem;
}

export const FileViewer: React.FC<Props> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const content = file.content && file.encoding === 'base64'
    ? decodeURIComponent(escape(atob(file.content.replace(/\n/g, ''))))
    : 'Binary file or raw content unavailable for direct preview.';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = content.split('\n');

  return (
    <div className="border border-border-default rounded-md bg-canvas-subtle overflow-hidden">
      <div className="px-4 py-2 bg-canvas-default border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{file.name}</span>
          <span className="text-gray-500">({lines.length} lines, {(file.size / 1024).toFixed(1)} KB)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-canvas-subtle border border-border-default px-2 py-1 rounded transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto p-4 bg-canvas-inset font-mono text-xs leading-relaxed text-gray-200">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-canvas-subtle/50">
                <td className="pr-4 text-right text-gray-600 select-none w-10 border-r border-border-subtle">{idx + 1}</td>
                <td className="pl-4 whitespace-pre">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};