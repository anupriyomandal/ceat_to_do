'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/store/taskStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";

export function SettingsPanel() {
  const { exportData, importData, clearAllData } = useTaskStore();
  const [importJson, setImportJson] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importJson.trim()) return;
    setIsImporting(true);
    await importData(importJson.trim());
    setImportJson('');
    setIsImporting(false);
  };

  const handleClear = async () => {
    await clearAllData();
    setShowClearConfirm(false);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ceat-tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4 text-primary" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download all your tasks and categories as a JSON file.
          </p>
          <Button variant="default" onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
            Export JSON
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="h-4 w-4 text-primary" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste previously exported JSON to restore your data.
          </p>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste JSON here..."
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          <Button
            variant="default"
            onClick={handleImport}
            isLoading={isImporting}
            disabled={!importJson.trim()}
            leftIcon={<Upload className="h-4 w-4" />}
          >
            Import JSON
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete all tasks and categories. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={() => setShowClearConfirm(true)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete all tasks and categories. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleClear}>Yes, Clear All</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
