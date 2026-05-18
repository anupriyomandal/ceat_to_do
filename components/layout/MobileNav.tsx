'use client';

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  KanbanSquare,
  MessageSquare,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/board", label: "Board", icon: KanbanSquare },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { openTaskForm } = useTaskStore();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <button
        onClick={() => openTaskForm()}
        className="lg:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-accent hover:brightness-110 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
