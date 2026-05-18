'use client';

import { KanbanBoard } from '@/components/KanbanBoard';
import { AppShell } from '@/components/AppShell';
import { KanbanSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/store/taskStore';

export default function BoardPage() {
  const { openTaskForm } = useTaskStore();

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KanbanSquare className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Board</h1>
          </div>
          <Button variant="accent" onClick={() => openTaskForm()} leftIcon={<Plus className="h-4 w-4" />}>
            New Task
          </Button>
        </div>

        <KanbanBoard />
      </div>
    </AppShell>
  );
}
