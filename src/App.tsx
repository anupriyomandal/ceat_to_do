import { useState, useEffect } from 'react';
import { useTaskStore } from './store/taskStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { TaskForm } from './components/TaskForm';
import { DashboardView } from './views/DashboardView';
import { ListView } from './views/ListView';
import { BoardView } from './views/BoardView';
import { ForumView } from './views/ForumView';
import { SettingsView } from './views/SettingsView';

const viewMap = {
  dashboard: DashboardView,
  list: ListView,
  board: BoardView,
  forum: ForumView,
  settings: SettingsView,
};

function App() {
  const { view, fetchData } = useTaskStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const CurrentView = viewMap[view];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen((s) => !s)} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-4 lg:p-6 pb-24 lg:pb-6 overflow-y-auto">
          <CurrentView />
        </main>
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <MobileNav />
      <TaskForm />
    </div>
  );
}

export default App;
