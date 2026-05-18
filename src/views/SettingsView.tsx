import React from 'react';
import { CategoryManager } from '../components/CategoryManager';
import { SettingsPanel } from '../components/SettingsPanel';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage categories and application data.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-black mb-4">Categories</h2>
        <CategoryManager />
      </section>

      <section>
        <SettingsPanel />
      </section>
    </div>
  );
};
