import React from 'react';
import { FilterBar } from '../components/FilterBar';
import { KanbanBoard } from '../components/KanbanBoard';

export const BoardView: React.FC = () => {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <FilterBar />
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
};
