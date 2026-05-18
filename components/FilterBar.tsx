'use client';

import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const { filter, setFilter, resetFilters, categories } = useTaskStore();

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const hasActiveFilters = filter.search || filter.priority !== 'all' || filter.category !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter tasks..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
        />
        {filter.search && (
          <button
            onClick={() => setFilter({ search: '' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filter.priority}
          onChange={(e) => setFilter({ priority: e.target.value as any })}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          className="h-10 w-40"
        />

        <Select
          value={filter.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          options={categoryOptions}
          className="h-10 w-44"
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
          leftIcon={<ArrowUpDown className="h-4 w-4" />}
        >
          {filter.sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<SlidersHorizontal className="h-4 w-4" />}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
