import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  KanbanSquare,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import type { ViewMode } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { view: 'list', label: 'My Tasks', icon: <ListTodo className="w-5 h-5" /> },
  { view: 'board', label: 'Board', icon: <KanbanSquare className="w-5 h-5" /> },
  { view: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { view, setView, openTaskForm } = useTaskStore();

  const handleNav = (v: ViewMode) => {
    setView(v);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-secondary text-white transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <button
            onClick={() => {
              openTaskForm();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-[#d96d18] text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === item.view
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              aria-current={view === item.view ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
              CE
            </div>
            <div className="text-xs">
              <p className="font-medium">CEAT Task Manager</p>
              <p className="text-white/60">Internal Tool</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
