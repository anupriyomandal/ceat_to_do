import React from 'react';
import { ArrowUpDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Button } from './ui/Button';

export const FilterBar: React.FC = () => {
  const { filter, setFilter, resetFilters, categories } = useTaskStore();

  const hasActiveFilters =
    filter.priority !== 'all' ||
    filter.category !== 'all' ||
    filter.sortBy !== 'createdAt' ||
    filter.sortOrder !== 'desc';

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-black">Filters</span>
      </div>

      <select
        value={filter.priority}
        onChange={(e) => setFilter({ priority: e.target.value as typeof filter.priority })}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-label="Filter by priority"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filter.category}
        onChange={(e) => setFilter({ category: e.target.value })}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as typeof filter.sortBy })}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Sort by"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        <button
          onClick={() => setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          aria-label="Toggle sort order"
          title={filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {filter.sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
        </button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
