import React from 'react'

export default function AdminLoading() {
  return (
    <div className="animate-fade-in-up">
      {/* Page Title Skeleton */}
      <div className="h-8 w-60 bg-gray-200 rounded-lg mb-6 shimmer-bg-dark" />
      
      {/* Skeleton Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0 shimmer-bg-dark" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4 shimmer-bg-dark" />
              <div className="h-6 bg-gray-200 rounded w-1/2 shimmer-bg-dark" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-48 shimmer-bg-dark" />
        </div>
        <div className="px-6 py-6 space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center justify-between">
              <div className="h-4 bg-gray-100 rounded w-1/6 shimmer-bg-dark" />
              <div className="h-4 bg-gray-100 rounded w-1/3 shimmer-bg-dark" />
              <div className="h-4 bg-gray-100 rounded w-1/5 shimmer-bg-dark" />
              <div className="h-4 bg-gray-100 rounded w-1/6 shimmer-bg-dark" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
