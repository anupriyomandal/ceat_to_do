import React from 'react';
import { useTaskStore, getFilteredTasks } from '../store/taskStore';
import { TaskCard } from './TaskCard';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';
import { Trash2, CheckSquare, Square } from 'lucide-react';

export const TaskList: React.FC = () => {
  const {
    tasks,
    filter,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkComplete,
    openTaskForm,
  } = useTaskStore();

  const filtered = getFilteredTasks(tasks, filter);
  const allSelected = filtered.length > 0 && filtered.every((t) => selectedIds.includes(t.id));

  return (
    <div className="space-y-4">
      {filtered.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (allSelected) clearSelection();
                else selectAll(filtered.map((t) => t.id));
              }}
              className="flex items-center gap-2 text-sm text-black hover:text-primary transition-colors"
              aria-label={allSelected ? 'Deselect all' : 'Select all'}
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
              <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="text-xs text-gray-500">
                {selectedIds.length} selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={bulkComplete}>
                Mark Complete
              </Button>
              <Button variant="danger" size="sm" onClick={bulkDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedIds.includes(task.id)}
            onSelect={() => toggleSelect(task.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && tasks.length > 0 && (
        <EmptyState title="No tasks match your filters" description="Try adjusting your search or filters." />
      )}

      {tasks.length === 0 && (
        <EmptyState
          actionLabel="Create your first task"
          onAction={() => openTaskForm()}
        />
      )}
    </div>
  );
};
