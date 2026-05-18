'use client';

import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Tag,
  Flag,
} from 'lucide-react';
import { formatDistanceToNow, isPast, isToday } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface TaskDetailCardProps {
  task: Task | null;
  onClose: () => void;
}

const priorityConfig = {
  low: { variant: 'low' as const, label: 'Low Priority', color: 'text-emerald-600' },
  medium: { variant: 'medium' as const, label: 'Medium Priority', color: 'text-amber-600' },
  high: { variant: 'high' as const, label: 'High Priority', color: 'text-red-600' },
};

const statusConfig = {
  todo: { label: 'To Do', className: 'bg-slate-100 text-slate-600' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-50 text-blue-600' },
  done: { label: 'Done', className: 'bg-emerald-50 text-emerald-600' },
};

export function TaskDetailCard({ task, onClose }: TaskDetailCardProps) {
  const { toggleTask, deleteTask, openTaskForm } = useTaskStore();

  if (!task) return null;

  const isOverdue =
    task.dueDate &&
    task.status !== 'done' &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 w-full max-w-lg rounded-xl border bg-card p-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold tracking-tight">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3
              className={cn(
                'text-xl font-bold leading-snug',
                task.status === 'done' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityConfig[task.priority].variant}>
              <Flag className="w-3 h-3 mr-1" />
              {priorityConfig[task.priority].label}
            </Badge>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', statusConfig[task.status].className)}>
              {statusConfig[task.status].label}
            </span>
            {task.category && (
              <Badge variant="outline">
                <Tag className="w-3 h-3 mr-1" />
                {task.category}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className={cn('font-medium', isOverdue && 'text-destructive')}>
                    {isOverdue ? 'Overdue' : new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {(task.assignedFrom || task.assignedTo) && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  {task.assignedFrom && (
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned From</p>
                      <p className="font-medium">{task.assignedFrom}</p>
                    </div>
                  )}
                  {task.assignedFrom && task.assignedTo && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-3" />
                  )}
                  {task.assignedTo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{task.assignedTo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-5 border-t bg-muted/30 rounded-b-xl">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              openTaskForm(task.id);
              onClose();
            }}
            leftIcon={<Pencil className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant={task.status === 'done' ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => toggleTask(task.id)}
            leftIcon={
              task.status === 'done' ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />
            }
          >
            {task.status === 'done' ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <div className="flex-1" />
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
