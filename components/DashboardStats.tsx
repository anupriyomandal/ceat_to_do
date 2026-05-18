'use client';

import { ListTodo, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { isToday, isPast } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

function StatCard({ label, value, icon, colorClass, bgClass }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardStats() {
  const { tasks } = useTaskStore();

  const total = tasks.length;
  const completedToday = tasks.filter(
    (t) => t.completedAt && isToday(new Date(t.completedAt))
  ).length;
  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== 'done' &&
      isPast(new Date(t.dueDate)) &&
      !isToday(new Date(t.dueDate))
  ).length;
  const highPriority = tasks.filter(
    (t) => t.priority === 'high' && t.status !== 'done'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Tasks"
        value={total}
        icon={<ListTodo className="w-6 h-6 text-primary" />}
        colorClass="text-primary"
        bgClass="bg-primary/10"
      />
      <StatCard
        label="Completed Today"
        value={completedToday}
        icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <StatCard
        label="Overdue"
        value={overdue}
        icon={<AlertTriangle className="w-6 h-6 text-accent" />}
        colorClass="text-accent"
        bgClass="bg-accent/10"
      />
      <StatCard
        label="High Priority"
        value={highPriority}
        icon={<TrendingUp className="w-6 h-6 text-red-500" />}
        colorClass="text-red-500"
        bgClass="bg-red-50"
      />
    </div>
  );
}
