import React from 'react';
import { FilterBar } from '../components/FilterBar';
import { TaskList } from '../components/TaskList';

export const ListView: React.FC = () => {
  return (
    <div className="space-y-4">
      <FilterBar />
      <TaskList />
    </div>
  );
};
