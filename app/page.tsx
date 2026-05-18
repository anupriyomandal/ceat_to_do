'use client';

import { useTaskStore, getFilteredTasks } from '@/store/taskStore';
import { DashboardStats } from '@/components/DashboardStats';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { AppShell } from '@/components/AppShell';
import { motion } from 'framer-motion';
import { ListTodo, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { tasks, filter, openTaskForm } = useTaskStore();
  const recentTasks = getFilteredTasks(tasks, { ...filter, sortBy: 'createdAt', sortOrder: 'desc' }).slice(0, 6);

  const overdueCount = tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()).length;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your tasks and activity</p>
          </div>
          <Button variant="accent" onClick={() => openTaskForm()} leftIcon={<Plus className="h-4 w-4" />}>
            New Task
          </Button>
        </div>

        <DashboardStats />

        {overdueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-sm font-medium text-accent">
              You have {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
            </div>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))
            ) : (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to get started."
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
