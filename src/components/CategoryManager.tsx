import React, { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useTaskStore();
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      setError('Category already exists');
      return;
    }
    addCategory(newCategory.trim());
    setNewCategory('');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label="New Category"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setError('');
            }}
            error={error}
            placeholder="e.g., Marketing, Engineering"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
          />
        </div>
        <Button variant="accent" onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-black">Existing Categories</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-sm text-black">{cat.name}</span>
              </div>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">No categories yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
