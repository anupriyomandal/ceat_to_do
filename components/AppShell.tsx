'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { MobileNav } from './layout/MobileNav';
import { TaskForm } from './TaskForm';
import { useTaskStore } from '@/store/taskStore';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { fetchData } = useTaskStore();
  const pathname = usePathname();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 pt-16"
      >
        <Sidebar />

        <main className="flex-1 lg:ml-64 p-4 lg:p-6 pb-24 lg:pb-6 overflow-y-auto"
        >
          {children}
        </main>
      </div>

      <MobileNav />
      <TaskForm />
    </div>
  );
}
