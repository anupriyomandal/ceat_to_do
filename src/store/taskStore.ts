import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Category, ViewMode, FilterState } from '../types';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  view: ViewMode;
  filter: FilterState;
  selectedIds: string[];
  isTaskFormOpen: boolean;
  editingTaskId: string | null;

  // CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  moveTaskStatus: (id: string, status: Task['status']) => void;

  // Bulk
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  bulkDelete: () => void;
  bulkComplete: () => void;

  // Categories
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;

  // Filter & View
  setView: (view: ViewMode) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Modals
  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;

  // Data management
  exportData: () => string;
  importData: (json: string) => void;
  clearAllData: () => void;
}

const initialCategories: Category[] = [
  { id: 'work', name: 'Work' },
  { id: 'personal', name: 'Personal' },
  { id: 'urgent', name: 'Urgent' },
  { id: 'ceat-projects', name: 'CEAT Projects' },
];

const initialFilters: FilterState = {
  search: '',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: initialCategories,
      view: 'dashboard',
      filter: initialFilters,
      selectedIds: [],
      isTaskFormOpen: false,
      editingTaskId: null,

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const isDone = t.status === 'done';
            return {
              ...t,
              status: isDone ? 'todo' : 'done',
              completedAt: isDone ? undefined : new Date().toISOString(),
            };
          }),
        }));
      },

      moveTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            return {
              ...t,
              status,
              completedAt: status === 'done' ? new Date().toISOString() : undefined,
            };
          }),
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

      bulkDelete: () => {
        const { selectedIds } = get();
        set((state) => ({
          tasks: state.tasks.filter((t) => !selectedIds.includes(t.id)),
          selectedIds: [],
        }));
      },

      bulkComplete: () => {
        const { selectedIds } = get();
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (!selectedIds.includes(t.id)) return t;
            return {
              ...t,
              status: 'done',
              completedAt: new Date().toISOString(),
            };
          }),
          selectedIds: [],
        }));
      },

      addCategory: (name) => {
        set((state) => ({
          categories: [
            ...state.categories,
            { id: crypto.randomUUID(), name },
          ],
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          tasks: state.tasks.map((t) =>
            t.category === id ? { ...t, category: '' } : t
          ),
        }));
      },

      setView: (view) => set({ view, selectedIds: [] }),

      setFilter: (filter) =>
        set((state) => ({ filter: { ...state.filter, ...filter } })),

      resetFilters: () => set({ filter: initialFilters }),

      openTaskForm: (taskId) => set({ isTaskFormOpen: true, editingTaskId: taskId || null }),
      closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),

      exportData: () => {
        const { tasks, categories } = get();
        return JSON.stringify({ tasks, categories }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (Array.isArray(data.tasks) && Array.isArray(data.categories)) {
            set({ tasks: data.tasks, categories: data.categories, selectedIds: [] });
          }
        } catch {
          // ignore invalid JSON
        }
      },

      clearAllData: () =>
        set({ tasks: [], categories: initialCategories, selectedIds: [] }),
    }),
    {
      name: 'ceat-task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        categories: state.categories,
        view: state.view,
        filter: state.filter,
      }),
    }
  )
);

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
