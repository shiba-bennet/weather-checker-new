import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="weather-loading-skeleton" className="w-full flex flex-col gap-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-slate-200 rounded w-48" />
            <div className="h-9 bg-slate-200 rounded w-64" />
            <div className="h-5 bg-slate-200 rounded-full w-36" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-12 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* 7-Day Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-slate-200 rounded w-36" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-36 bg-white border border-slate-200/80 rounded-xl p-3 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded-lg my-2" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="h-5 bg-slate-200 rounded w-44 mb-4" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
};
