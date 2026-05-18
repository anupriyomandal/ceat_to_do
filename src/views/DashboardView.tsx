import React from 'react';
import { useTaskStore, getFilteredTasks } from '../store/taskStore';
import { DashboardStats } from '../components/DashboardStats';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const DashboardView: React.FC = () => {
  const { tasks, filter, openTaskForm } = useTaskStore();
  const recent = getFilteredTasks(tasks, { ...filter, sortBy: 'createdAt', sortOrder: 'desc' }).slice(0, 5);

  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-black">Recent Tasks</h2>
          <Button variant="ghost" size="sm" onClick={() => openTaskForm()}>
            + New Task
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {recent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {recent.length === 0 && (
            <EmptyState
              title="No tasks yet"
              description="Get started by creating your first task."
              actionLabel="Create Task"
              onAction={() => openTaskForm()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
