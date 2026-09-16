import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { RepoPage } from './pages/RepoPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-canvas-default text-gray-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:owner/:repo" element={<RepoPage />} />
            <Route path="/:owner/:repo/tree/*" element={<RepoPage />} />
            <Route path="/:owner/:repo/blob/*" element={<RepoPage />} />
            <Route path="/:owner/:repo/issues" element={<RepoPage />} />
            <Route path="/:owner/:repo/commits" element={<RepoPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;