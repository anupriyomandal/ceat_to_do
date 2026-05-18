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
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "My Tasks", icon: ListTodo },
  { href: "/board", label: "Board", icon: KanbanSquare },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openTaskForm } = useTaskStore();

  return (
    <aside className={cn("flex flex-col h-full bg-secondary text-white", mobile ? "" : "hidden lg:flex w-64 fixed left-0 top-16 bottom-0")}>
      <div className="p-4">
        <Button
          onClick={() => openTaskForm()}
          variant="accent"
          className="w-full shadow-sm"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Task
        </Button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
            CE
          </div>
          <div className="text-xs">
            <p className="font-medium">CEAT Task Manager</p>
            <p className="text-white/50">Internal Tool</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
