import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-canvas-subtle border-b border-border-default sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white hover:opacity-90 transition">
          <Github className="w-7 h-7" />
          <span className="hidden sm:inline text-sm tracking-wide">RepoExplorer</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories (e.g. facebook/react, rust-lang/rust)..."
            className="w-full bg-canvas-default border border-border-default rounded-md pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
          />
        </form>

        <a
          href="https://docs.github.com/en/rest"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-400 hover:text-accent-blue transition"
        >
          API Docs ↗
        </a>
      </div>
    </header>
  );
};