import React from 'react';
import { Search, Settings, Menu } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { filter, setFilter, setView } = useTaskStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-primary text-white shadow-md">
      <div className="flex items-center h-full px-4 lg:px-6 gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 min-w-fit">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-bold text-lg hidden sm:inline">CEAT Task Manager</span>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
              aria-label="Search tasks"
            />
          </div>
        </div>

        <button
          onClick={() => setView('settings')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
