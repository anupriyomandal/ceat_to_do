'use client';

import { Settings } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { SettingsPanel } from '@/components/SettingsPanel';
import { CategoryManager } from '@/components/CategoryManager';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>

        <CategoryManager />
        <SettingsPanel />
      </div>
    </AppShell>
  );
}
