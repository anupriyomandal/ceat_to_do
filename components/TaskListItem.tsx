'use client';

import { useTaskStore } from '@/store/taskStore';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const priorityBorder: Record<Task['priority'], string> = {
  low: 'border-l-emerald-500',
  medium: 'border-l-amber-500',
  high: 'border-l-red-500',
};

const statusBg: Record<Task['status'], string> = {
  todo: 'bg-card',
  'in-progress': 'bg-blue-50/60',
  done: 'bg-emerald-50/50',
};

interface TaskListItemProps {
  task: Task;
  onClick: () => void;
}

export function TaskListItem({ task, onClick }: TaskListItemProps) {
  const { toggleSelect, selectedIds } = useTaskStore();
  const isSelected = selectedIds.includes(task.id);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border border-border px-5 py-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 border-l-4',
        statusBg[task.status],
        priorityBorder[task.priority],
        task.status === 'done' && 'opacity-50',
        isSelected && 'ring-2 ring-primary/30'
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={() => toggleSelect(task.id)}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'text-sm font-semibold truncate transition-colors',
            task.status === 'done' && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            task.status === 'todo' && 'bg-slate-400',
            task.status === 'in-progress' && 'bg-blue-500',
            task.status === 'done' && 'bg-emerald-500'
          )}
        />
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          {task.status === 'todo' && 'To Do'}
          {task.status === 'in-progress' && 'In Progress'}
          {task.status === 'done' && 'Done'}
        </span>
      </div>
    </div>
  );
}
