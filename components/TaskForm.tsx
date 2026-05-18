'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';

export function TaskForm() {
  const {
    isTaskFormOpen,
    closeTaskForm,
    editingTaskId,
    tasks,
    categories,
    addTask,
    updateTask,
  } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [category, setCategory] = useState('');
  const [assignedFrom, setAssignedFrom] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (editingTaskId) {
      const task = tasks.find((t) => t.id === editingTaskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate || '');
        setPriority(task.priority);
        setStatus(task.status);
        setCategory(task.category);
        setAssignedFrom(task.assignedFrom || '');
        setAssignedTo(task.assignedTo || '');
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setStatus('todo');
      setCategory(categories[0]?.id || '');
      setAssignedFrom('');
      setAssignedTo('');
    }
    setErrors({});
    setApiError('');
    setIsSubmitting(false);
  }, [editingTaskId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      newErrors.dueDate = 'Invalid date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
      status,
      category,
      assignedFrom: assignedFrom.trim() || undefined,
      assignedTo: assignedTo.trim() || undefined,
    };

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, taskData);
      } else {
        await addTask(taskData);
      }
      closeTaskForm();
    } catch (err: any) {
      setApiError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'No Category' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Dialog open={isTaskFormOpen} onOpenChange={(open) => !open && closeTaskForm()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTaskId ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            error={errors.title}
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              error={errors.dueDate}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Assigned From"
              value={assignedFrom}
              onChange={(e) => setAssignedFrom(e.target.value)}
              placeholder="e.g. Manager"
            />
            <Input
              label="Assigned To"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Team Member"
            />
          </div>

          {apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {apiError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={closeTaskForm} type="button">
              Cancel
            </Button>
            <Button
              variant="accent"
              isLoading={isSubmitting}
              disabled={!title.trim()}
              type="submit"
            >
              {editingTaskId ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
