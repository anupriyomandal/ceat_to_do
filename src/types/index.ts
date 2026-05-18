export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';
export type ViewMode = 'dashboard' | 'list' | 'board' | 'settings';
export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface Category {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface FilterState {
  search: string;
  priority: Priority | 'all';
  category: string | 'all';
  sortBy: SortBy;
  sortOrder: 'asc' | 'desc';
}

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};
