import { Task, Category } from '../types';
import { Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-blue-100 border-blue-300 text-blue-800',
  medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  high: 'bg-red-100 border-red-300 text-red-800',
};

export function TaskCard({ task, category, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete(task.id);
    } catch (error) {
      console.error('Delete failed:', error);
      setIsDeleting(false);
    }
  };

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isDueToday = dueDate && dueDate.toDateString() === new Date().toDateString();
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 text-sm line-clamp-2 break-words">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 hover:text-red-500 disabled:opacity-50"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        {category && (
          <span
            className="text-xs font-medium px-2 py-1 rounded text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}

        {dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-500'}`}>
            <Calendar size={12} />
            {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
}
