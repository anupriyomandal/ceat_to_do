"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("Sheet components must be wrapped in <Sheet>");
  return context;
}

function SheetTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useSheet();
  return (
    <div onClick={() => onOpenChange(true)} className="cursor-pointer inline-flex">
      {children}
    </div>
  );
}

function SheetContent({
  className,
  children,
  side = "right",
}: {
  className?: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}) {
  const { open, onOpenChange } = useSheet();

  if (!open) return null;

  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm data-[state=open]:slide-in-from-left",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm data-[state=open]:slide-in-from-right",
    top: "inset-x-0 top-0 h-auto w-full data-[state=open]:slide-in-from-top",
    bottom: "inset-x-0 bottom-0 h-auto w-full data-[state=open]:slide-in-from-bottom",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed z-50 bg-card p-6 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side],
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export { Sheet, SheetTrigger, SheetContent };
