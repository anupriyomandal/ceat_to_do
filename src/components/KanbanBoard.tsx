import React from 'react';
import { useTaskStore, getFilteredTasks } from '../store/taskStore';
import { KanbanColumn } from './KanbanColumn';
import { EmptyState } from './ui/EmptyState';

export const KanbanBoard: React.FC = () => {
  const { tasks, filter, openTaskForm } = useTaskStore();
  const filtered = getFilteredTasks(tasks, filter);

  const todo = filtered.filter((t) => t.status === 'todo');
  const inProgress = filtered.filter((t) => t.status === 'in-progress');
  const done = filtered.filter((t) => t.status === 'done');

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Start organizing your work on the Kanban board."
        actionLabel="Create your first task"
        onAction={() => openTaskForm()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <KanbanColumn status="todo" title="To Do" tasks={todo} />
      <KanbanColumn status="in-progress" title="In Progress" tasks={inProgress} />
      <KanbanColumn status="done" title="Done" tasks={done} />
    </div>
  );
};
