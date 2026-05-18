'use client';

import { Plus } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/Button";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "@/store/taskStore";
import type { Task, Status } from "@/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
}

const statusColors: Record<Status, string> = {
  todo: "bg-slate-50 border-slate-200",
  "in-progress": "bg-blue-50/50 border-blue-200",
  done: "bg-emerald-50/50 border-emerald-200",
};

const statusDot: Record<Status, string> = {
  todo: "bg-slate-400",
  "in-progress": "bg-blue-500",
  done: "bg-emerald-500",
};

export function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  const { openTaskForm } = useTaskStore();

  return (
    <div className={cn("flex flex-col rounded-xl border p-3 min-h-[200px]", statusColors[status])}
    >
      <div className="flex items-center justify-between mb-3 px-1"
      >
        <div className="flex items-center gap-2"
        >
          <div className={cn("w-2.5 h-2.5 rounded-full", statusDot[status])} />
          <h3 className="font-semibold text-sm"
          >{title}</h3
          >
          <span className="text-xs text-muted-foreground bg-white/80 px-2 py-0.5 rounded-full"
          >
            {tasks.length}
          </span>
        </div
        >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => openTaskForm()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Droppable droppableId={status}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 space-y-3 min-h-[100px] rounded-lg transition-colors",
              snapshot.isDraggingOver && "bg-black/5"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
