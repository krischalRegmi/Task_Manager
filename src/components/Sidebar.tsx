import { Category, Task, TaskStatus } from '../types';
import { Plus, Trash2, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  categories: Category[];
  tasks: Task[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

const categoryColors = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
];

export function Sidebar({
  categories,
  tasks,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
}: SidebarProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(categoryColors[0]);
  const [loading, setLoading] = useState(false);

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
    return stats;
  };

  const getCategoryTaskCount = (categoryId: string) => {
    return tasks.filter(t => t.category_id === categoryId).length;
  };

  const stats = getTaskStats();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      await onAddCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor(categoryColors[0]);
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Statistics</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Total Tasks</span>
            <span className="font-semibold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>To Do</span>
            <span className="font-semibold text-blue-600">{stats.todo}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>In Progress</span>
            <span className="font-semibold text-amber-600">{stats.inProgress}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Done</span>
            <span className="font-semibold text-green-600">{stats.done}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Add category"
          >
            <Plus size={18} />
          </button>
        </div>

        {isAddingCategory && (
          <form onSubmit={handleAddCategory} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              autoFocus
            />
            <div className="flex gap-1 mb-3">
              {categoryColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    newCategoryColor === color ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                  title={color}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                disabled={loading}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">All Tasks</span>
              <span className="text-xs font-medium">{stats.total}</span>
            </div>
          </button>

          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2">No categories yet</p>
          ) : (
            categories.map(category => (
              <div
                key={category.id}
                className="group flex items-center gap-2"
              >
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm truncate flex-1">{category.name}</span>
                  <span className="text-xs font-medium text-gray-500">
                    {getCategoryTaskCount(category.id)}
                  </span>
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
