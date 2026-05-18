import React from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Status } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: import('../types').Task[];
}

const columnColors: Record<Status, string> = {
  todo: 'border-t-primary',
  'in-progress': 'border-t-accent',
  done: 'border-t-green-500',
};

const columnHeaderColors: Record<Status, string> = {
  todo: 'text-primary',
  'in-progress': 'text-accent',
  done: 'text-green-600',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, tasks }) => {
  const { moveTaskStatus } = useTaskStore();
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-50 rounded-xl border border-gray-200 border-t-4 ${columnColors[status]} transition-colors ${
        isOver ? 'bg-blue-50/50 ring-2 ring-primary/30' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className={`font-semibold text-sm ${columnHeaderColors[status]}`}>
          {title}
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 p-3 space-y-3 min-h-[120px] overflow-y-auto scrollbar-thin">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} isDragging={false} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};
