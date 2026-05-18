import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary/10 text-secondary border border-secondary/20",
        accent: "bg-accent/10 text-accent border border-accent/20",
        outline: "text-foreground border border-input",
        low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        medium: "bg-amber-50 text-amber-700 border border-amber-200",
        high: "bg-red-50 text-red-700 border border-red-200",
        done: "bg-slate-100 text-slate-600 border border-slate-200 line-through opacity-70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
