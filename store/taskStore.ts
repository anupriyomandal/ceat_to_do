'use client';

import { create } from 'zustand';
import type { Task, Category, FilterState, Status } from '../types';

// API calls go through Vercel rewrites (/api/* -> Railway backend)
// This avoids CORS and keeps everything same-origin
const API_BASE = '';

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
      if (!tasksRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch');
      const tasks = await tasksRes.json();
      const categories = await categoriesRes.json();
      set({ tasks, categories, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      set({ isLoading: false });
    }
  },

  addTask: async (task) => {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create task' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const newTask = await res.json();
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  updateTask: async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update task' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const updatedTask = await res.json();
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }));
  },

  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }));
  },

  toggleTask: async (id) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/toggle`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle task');
    const updatedTask = await res.json();
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }));
  },

  moveTaskStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to move task');
    const updatedTask = await res.json();
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }));
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
    const res = await fetch(`${API_BASE}/api/tasks/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete');
    set({
      tasks: tasks.filter((t) => !selectedIds.includes(t.id)),
      selectedIds: [],
    });
  },

  bulkComplete: async () => {
    const { selectedIds, tasks } = get();
    if (selectedIds.length === 0) return;
    const res = await fetch(`${API_BASE}/api/tasks/bulk-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    if (!res.ok) throw new Error('Failed to bulk complete');
    const now = new Date().toISOString();
    set({
      tasks: tasks.map((t) =>
        selectedIds.includes(t.id)
          ? { ...t, status: 'done' as Status, completedAt: now }
          : t
      ),
      selectedIds: [],
    });
  },

  addCategory: async (name) => {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to add category');
    const newCategory = await res.json();
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      tasks: state.tasks.map((t) =>
        t.category === id ? { ...t, category: '' } : t
      ),
    }));
  },

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  resetFilters: () => set({ filter: initialFilters }),

  openTaskForm: (taskId) =>
    set({ isTaskFormOpen: true, editingTaskId: taskId || null }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),

  importData: async (json) => {
    const res = await fetch(`${API_BASE}/api/tasks/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.parse(json)),
    });
    if (!res.ok) throw new Error('Failed to import data');
    await get().fetchData();
  },

  clearAllData: async () => {
    const res = await fetch(`${API_BASE}/api/tasks/clear`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to clear data');
    set({ tasks: [], categories: [], selectedIds: [] });
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
