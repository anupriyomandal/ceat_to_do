import React from 'react';
import { Calendar, Pencil, Trash2, GripVertical } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { useTaskStore } from '../store/taskStore';
import type { Task } from '../types';
import { Badge } from './ui/Badge';
import { Checkbox } from './ui/Checkbox';

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onSelect?: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-secondary' },
  medium: { label: 'Medium', color: 'bg-accent' },
  high: { label: 'High', color: 'bg-red-500' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected = false,
  onSelect,
  isDragging = false,
}) => {
  const { toggleTask, openTaskForm, deleteTask } = useTaskStore();
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done' && !isToday(new Date(task.dueDate));
  const priority = priorityConfig[task.priority];

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
        isDragging ? 'shadow-lg rotate-2 opacity-90' : 'shadow-sm'
      } ${task.status === 'done' ? 'opacity-75' : ''} ${
        isOverdue ? 'border-accent/50' : 'border-gray-200'
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {onSelect && (
          <div className="pt-1">
            <Checkbox checked={isSelected} onChange={onSelect} aria-label={`Select ${task.title}`} />
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={() => toggleTask(task.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.status === 'done'
                ? 'bg-primary border-primary'
                : 'border-gray-300 hover:border-primary'
            }`}
            aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'done' && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-medium text-black leading-tight ${
                task.status === 'done' ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openTaskForm(task.id)}
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                aria-label="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`w-2 h-2 rounded-full ${priority.color}`} aria-hidden="true" />
            <span className="text-xs text-gray-500 font-medium">{priority.label}</span>

            {task.category && (
              <Badge variant="neutral">{task.category}</Badge>
            )}

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-accent font-medium' : 'text-gray-500'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}

            <span className="ml-auto text-[10px] text-gray-400 uppercase tracking-wide">
              {task.status === 'todo' && 'To Do'}
              {task.status === 'in-progress' && 'In Progress'}
              {task.status === 'done' && 'Done'}
            </span>
          </div>
        </div>

        <div className="pt-1 cursor-grab active:cursor-grabbing text-gray-300">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
