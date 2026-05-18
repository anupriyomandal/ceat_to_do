import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Button } from './ui/Button';
import { ConfirmDialog } from './ConfirmDialog';

export const SettingsPanel: React.FC = () => {
  const { exportData, importData, clearAllData } = useTaskStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ceat-tasks-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = String(ev.target?.result || '');
      await importData(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-black mb-4">Data Management</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-black">Export Tasks</h3>
              <p className="text-xs text-gray-500 mt-0.5">Download your tasks as a JSON file.</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>

          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-black">Import Tasks</h3>
              <p className="text-xs text-gray-500 mt-0.5">Restore tasks from a previously exported JSON file.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleImportClick} leftIcon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600">Clear All Data</h3>
              <p className="text-xs text-gray-500 mt-0.5">Permanently delete all tasks and categories. This cannot be undone.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={clearAllData}
        title="Clear all data?"
        message="This will permanently delete all tasks and categories. This action cannot be undone."
        confirmLabel="Yes, clear everything"
        variant="danger"
      />
    </div>
  );
};
