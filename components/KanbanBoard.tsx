'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTaskStore } from "@/store/taskStore";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const columns: { status: Status; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

const statusColors: Record<Status, string> = {
  todo: "bg-slate-50 border-slate-200",
  'in-progress': "bg-blue-50/50 border-blue-200",
  done: "bg-emerald-50/50 border-emerald-200",
};

const statusDot: Record<Status, string> = {
  todo: "bg-slate-400",
  'in-progress': "bg-blue-500",
  done: "bg-emerald-500",
};

export function KanbanBoard() {
  const { tasks, moveTaskStatus } = useTaskStore();

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceStatus = result.source.droppableId as Status;
    const destStatus = result.destination.droppableId as Status;
    const taskId = result.draggableId;

    if (sourceStatus === destStatus) return;
    await moveTaskStatus(taskId, destStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className={cn("flex flex-col rounded-xl border p-3 min-h-[500px]", statusColors[col.status])}
            >
              <div className="flex items-center gap-2 mb-3 px-1"
              >
                <div className={cn("w-2.5 h-2.5 rounded-full", statusDot[col.status])} />
                <h3 className="font-semibold text-sm"
                >{col.title}</h3
                >
                <span className="text-xs text-muted-foreground bg-white/80 px-2 py-0.5 rounded-full"
                >
                  {colTasks.length}
                </span>
              </div
              >
              <Droppable droppableId={col.status}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 space-y-3 min-h-[100px] rounded-lg transition-colors p-1",
                      snapshot.isDraggingOver && "bg-black/5"
                    )}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-transform",
                              snapshot.isDragging && "rotate-2 opacity-90"
                            )}
                            style={provided.draggableProps.style}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
