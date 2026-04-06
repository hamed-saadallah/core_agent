import React from 'react';

/** Inline fallback for React.Suspense while lazy route chunks load */
export const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[40vh] p-6">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3" />
      <p className="text-gray-600 text-sm">Loading page…</p>
    </div>
  </div>
);
