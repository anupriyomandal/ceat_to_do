import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Priority, Status } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

export const TaskForm: React.FC = () => {
  const { tasks, categories, isTaskFormOpen, editingTaskId, closeTaskForm, addTask, updateTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [category, setCategory] = useState('');
  const [assignedFrom, setAssignedFrom] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(editingTaskId);

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
    setIsSubmitting(false);
  }, [editingTaskId]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Title is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
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
      if (isEditing && editingTaskId) {
        await updateTask(editingTaskId, payload);
      } else {
        await addTask(payload);
      }
      closeTaskForm();
    } catch {
      setIsSubmitting(false);
    }
  };

  const selectClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

  return (
    <Modal
      isOpen={isTaskFormOpen}
      onClose={closeTaskForm}
      title={isEditing ? 'Edit Task' : 'New Task'}
      footer={
        <>
          <Button variant="ghost" onClick={closeTaskForm}>Cancel</Button>
          <Button variant="accent" onClick={handleSubmit} isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Enter task title"
          autoFocus
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={selectClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={selectClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className={selectClass}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Assigned From"
            value={assignedFrom}
            onChange={(e) => setAssignedFrom(e.target.value)}
            placeholder="Assigner name"
          />
          <Input
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Assignee name"
          />
        </div>
      </form>
    </Modal>
  );
};
