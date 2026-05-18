import React from 'react';
import { ListTodo, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { isToday, isPast } from 'date-fns';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('accent', 'orange-100')}`}>
          <span className={colorClass}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
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
        icon={<ListTodo className="w-6 h-6" />}
        colorClass="text-primary"
      />
      <StatCard
        label="Completed Today"
        value={completedToday}
        icon={<CheckCircle className="w-6 h-6" />}
        colorClass="text-green-600"
      />
      <StatCard
        label="Overdue"
        value={overdue}
        icon={<AlertTriangle className="w-6 h-6" />}
        colorClass="text-accent"
      />
      <StatCard
        label="High Priority"
        value={highPriority}
        icon={<TrendingUp className="w-6 h-6" />}
        colorClass="text-red-500"
      />
    </div>
  );
};
