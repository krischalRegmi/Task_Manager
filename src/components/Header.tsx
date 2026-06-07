import { TaskPriority, TaskStatus } from '../types';
import { Search, Plus, Filter } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  priority: TaskPriority | null;
  onPriorityChange: (priority: TaskPriority | null) => void;
  status: TaskStatus | null;
  onStatusChange: (status: TaskStatus | null) => void;
  sort: 'due_date' | 'priority' | 'created_at';
  onSortChange: (sort: 'due_date' | 'priority' | 'created_at') => void;
  onAddTask: () => void;
}

export function Header({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onAddTask,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="p-6 space-y-4">
        {/* Top row with search and add button */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="Toggle filters"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={onAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status || ''}
                onChange={(e) => onStatusChange((e.target.value || null) as TaskStatus | null)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority || ''}
                onChange={(e) => onPriorityChange((e.target.value || null) as TaskPriority | null)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as 'due_date' | 'priority' | 'created_at')}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Newest First</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => {
                  onSearchChange('');
                  onStatusChange(null);
                  onPriorityChange(null);
                  onSortChange('created_at');
                }}
                className="w-full px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors mt-6"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
