import React from 'react';
import { LayoutDashboard, ListTodo, KanbanSquare, MessageSquare, Settings, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import type { ViewMode } from '../../types';

const navItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
  { view: 'list', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
  { view: 'board', label: 'Board', icon: <KanbanSquare className="w-5 h-5" /> },
  { view: 'forum', label: 'Forum', icon: <MessageSquare className="w-5 h-5" /> },
  { view: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const MobileNav: React.FC = () => {
  const { view, setView, openTaskForm } = useTaskStore();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                view === item.view ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <button
        onClick={() => openTaskForm()}
        className="lg:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-accent hover:bg-[#d96d18] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};
