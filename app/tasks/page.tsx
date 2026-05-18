'use client';

import { useState } from 'react';
import { useTaskStore, getFilteredTasks } from '@/store/taskStore';
import { FilterBar } from '@/components/FilterBar';
import { TaskListItem } from '@/components/TaskListItem';
import { TaskDetailCard } from '@/components/TaskDetailCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { AppShell } from '@/components/AppShell';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Plus, Trash2, CheckCircle } from 'lucide-react';
import type { Task } from '@/types';

export default function TasksPage() {
  const {
    tasks,
    filter,
    selectedIds,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkComplete,
    openTaskForm,
  } = useTaskStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = getFilteredTasks(tasks, filter);
  const allSelected = filteredTasks.length > 0 && filteredTasks.every((t) => selectedIds.includes(t.id));

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
            <span className="text-sm text-muted-foreground">({filteredTasks.length})</span>
          </div>
          <Button variant="accent" onClick={() => openTaskForm()} leftIcon={<Plus className="h-4 w-4" />}>
            New Task
          </Button>
        </div>

        <FilterBar />

        {filteredTasks.length > 0 && (
          <div className="flex items-center justify-between">
            <Checkbox
              label={`Select all (${filteredTasks.length})`}
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  clearSelection();
                } else {
                  selectAll(filteredTasks.map((t) => t.id));
                }
              }}
            />
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={bulkComplete} leftIcon={<CheckCircle className="h-4 w-4" />}>
                  Complete ({selectedIds.length})
                </Button>
                <Button variant="danger" size="sm" onClick={bulkDelete} leftIcon={<Trash2 className="h-4 w-4" />}>
                  Delete ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <TaskListItem task={task} onClick={() => setSelectedTask(task)} />
                </motion.div>
              ))
            ) : (
              <EmptyState
                title="No tasks found"
                description="Try adjusting your filters or create a new task."
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <TaskDetailCard task={selectedTask} onClose={() => setSelectedTask(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
