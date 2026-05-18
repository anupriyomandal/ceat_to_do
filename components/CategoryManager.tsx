'use client';

import { useState } from 'react';
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTaskStore } from "@/store/taskStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useTaskStore();
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    setIsAdding(true);
    await addCategory(newCategory.trim());
    setNewCategory('');
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="h-4 w-4 text-primary" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button
            variant="accent"
            size="sm"
            onClick={handleAdd}
            isLoading={isAdding}
            disabled={!newCategory.trim()}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-2.5 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-medium">{cat.name}</span>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
