'use client';

import { Calendar, Clock, User, ArrowRight, Trash2, Pencil } from "lucide-react";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { useTaskStore } from "@/store/taskStore";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

const priorityConfig = {
  low: { variant: "low" as const, border: "border-l-emerald-500" },
  medium: { variant: "medium" as const, border: "border-l-amber-500" },
  high: { variant: "high" as const, border: "border-l-red-500" },
};

const statusConfig = {
  todo: { label: "To Do", className: "bg-slate-100 text-slate-600" },
  "in-progress": { label: "In Progress", className: "bg-blue-50 text-blue-600" },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-600" },
};

interface TaskCardProps {
  task: Task;
  selectable?: boolean;
}

export function TaskCard({ task, selectable }: TaskCardProps) {
  const { toggleTask, deleteTask, openTaskForm, toggleSelect, selectedIds } = useTaskStore();
  const isSelected = selectedIds.includes(task.id);
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <Card className={cn(
      "relative border-l-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5",
      priorityConfig[task.priority].border,
      task.status === 'done' && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {selectable && (
            <Checkbox
              checked={isSelected}
              onChange={() => toggleSelect(task.id)}
              className="mt-1"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold text-sm leading-snug",
                  task.status === 'done' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openTaskForm(task.id)}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant={priorityConfig[task.priority].variant}>
                {task.priority}
              </Badge>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", statusConfig[task.status].className)}>
                {statusConfig[task.status].label}
              </span>
              {task.category && (
                <Badge variant="outline">{task.category}</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              {task.dueDate && (
                <span className={cn("flex items-center gap-1", isOverdue && "text-destructive font-medium")}>
                  <Calendar className="h-3 w-3" />
                  {isOverdue ? 'Overdue' : new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
              </span>
              {(task.assignedFrom || task.assignedTo) && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assignedFrom && <span>From: {task.assignedFrom}</span>}
                  {task.assignedFrom && task.assignedTo && <ArrowRight className="h-3 w-3" />}
                  {task.assignedTo && <span>To: {task.assignedTo}</span>}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleTask(task.id)}
            className={cn(
              "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              task.status === 'done'
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-muted-foreground/30 hover:border-primary"
            )}
          >
            {task.status === 'done' && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
