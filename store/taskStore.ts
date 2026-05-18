'use client';

import { create } from 'zustand';
import type { Task, Category, FilterState, Status } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  filter: FilterState;
  selectedIds: string[];
  isTaskFormOpen: boolean;
  editingTaskId: string | null;
  isLoading: boolean;

  fetchData: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  moveTaskStatus: (id: string, status: Task['status']) => Promise<void>;

  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  bulkDelete: () => Promise<void>;
  bulkComplete: () => Promise<void>;

  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;

  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;

  importData: (json: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  exportData: () => string;
}

const initialFilters: FilterState = {
  search: '',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [],
  filter: initialFilters,
  selectedIds: [],
  isTaskFormOpen: false,
  editingTaskId: null,
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [tasksRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/api/tasks`),
        fetch(`${API_BASE}/api/categories`),
      ]);
      const tasks = await tasksRes.json();
      const categories = await categoriesRes.json();
      set({ tasks, categories, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      set({ isLoading: false });
    }
  },

  addTask: async (task) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedTask = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  },

  deleteTask: async (id) => {
    try {
      await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
      }));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  },

  toggleTask: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}/toggle`, { method: 'POST' });
      const updatedTask = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  },

  moveTaskStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updatedTask = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  },

  toggleSelect: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    }));
  },

  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  bulkDelete: async () => {
    const { selectedIds, tasks } = get();
    if (selectedIds.length === 0) return;
    try {
      await fetch(`${API_BASE}/api/tasks/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      set({
        tasks: tasks.filter((t) => !selectedIds.includes(t.id)),
        selectedIds: [],
      });
    } catch (err) {
      console.error('Failed to bulk delete:', err);
    }
  },

  bulkComplete: async () => {
    const { selectedIds, tasks } = get();
    if (selectedIds.length === 0) return;
    try {
      await fetch(`${API_BASE}/api/tasks/bulk-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const now = new Date().toISOString();
      set({
        tasks: tasks.map((t) =>
          selectedIds.includes(t.id)
            ? { ...t, status: 'done' as Status, completedAt: now }
            : t
        ),
        selectedIds: [],
      });
    } catch (err) {
      console.error('Failed to bulk complete:', err);
    }
  },

  addCategory: async (name) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const newCategory = await res.json();
      set((state) => ({
        categories: [...state.categories, newCategory],
      }));
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  },

  deleteCategory: async (id) => {
    try {
      await fetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE' });
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        tasks: state.tasks.map((t) =>
          t.category === id ? { ...t, category: '' } : t
        ),
      }));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  },

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  resetFilters: () => set({ filter: initialFilters }),

  openTaskForm: (taskId) =>
    set({ isTaskFormOpen: true, editingTaskId: taskId || null }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),

  importData: async (json) => {
    try {
      const data = JSON.parse(json);
      await fetch(`${API_BASE}/api/tasks/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await get().fetchData();
    } catch (err) {
      console.error('Failed to import data:', err);
    }
  },

  clearAllData: async () => {
    try {
      await fetch(`${API_BASE}/api/tasks/clear`, { method: 'POST' });
      set({ tasks: [], categories: [], selectedIds: [] });
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
  },

  exportData: () => {
    const { tasks, categories } = get();
    return JSON.stringify({ tasks, categories }, null, 2);
  },
}));

export function getFilteredTasks(tasks: Task[], filter: FilterState): Task[] {
  let result = [...tasks];

  if (filter.search.trim()) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  if (filter.priority !== 'all') {
    result = result.filter((t) => t.priority === filter.priority);
  }

  if (filter.category !== 'all') {
    result = result.filter((t) => t.category === filter.category);
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (filter.sortBy) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'priority': {
        const pw = { low: 1, medium: 2, high: 3 };
        cmp = pw[a.priority] - pw[b.priority];
        break;
      }
      case 'dueDate': {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
        break;
      }
      case 'createdAt':
      default:
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return filter.sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}
