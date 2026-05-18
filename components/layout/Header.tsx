'use client';

import { Menu, Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/store/taskStore";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/Sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  const { filter, setFilter, openTaskForm } = useTaskStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="h-full overflow-y-auto">
                <Sidebar mobile />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline-block">CEAT Task Manager</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="h-9 w-64 rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
            />
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={() => openTaskForm()}
            className="hidden sm:inline-flex"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            New Task
          </Button>

          <Button
            variant="accent"
            size="icon"
            onClick={() => openTaskForm()}
            className="sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
