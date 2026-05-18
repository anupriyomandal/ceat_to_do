'use client';

import { useTaskStore, getFilteredTasks } from '@/store/taskStore';
import { FilterBar } from '@/components/FilterBar';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { ListTodo, Plus, Trash2, CheckCircle } from 'lucide-react';

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

        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <TaskCard task={task} selectable />
              </motion.div>
            ))
          ) : (
            <EmptyState
              title="No tasks found"
              description="Try adjusting your filters or create a new task."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
