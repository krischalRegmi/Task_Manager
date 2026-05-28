import { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useCategories } from './hooks/useCategories';
import { Task, TaskFilters, TaskPriority, TaskStatus } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskForm } from './components/TaskForm';
import { Toast, useToast } from './components/Toast';

function App() {
  const { toast, show, hide } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null);
  const [sort, setSort] = useState<'due_date' | 'priority' | 'created_at'>('created_at');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filters: TaskFilters = {
    category_id: selectedCategory || undefined,
    search,
    priority: filterPriority || undefined,
    status: filterStatus || undefined,
    sort,
  };

  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask } = useTasks(filters);
  const { categories, loading: categoriesLoading, error: categoriesError, createCategory, deleteCategory } = useCategories();

  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  const handleSaveTask = async (taskData: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        show('Task updated successfully', 'success');
      } else {
        await createTask(taskData);
        show('Task created successfully', 'success');
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      show('Task deleted successfully', 'success');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to delete task', 'error');
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await updateTask(id, updates);
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to update task', 'error');
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    try {
      await createCategory(name, color);
      show('Category created successfully', 'success');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      show('Category deleted successfully', 'success');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Failed to delete category', 'error');
    }
  };

  const handleOpenForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        categories={categories}
        tasks={tasks}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          search={search}
          onSearchChange={setSearch}
          priority={filterPriority}
          onPriorityChange={setFilterPriority}
          status={filterStatus}
          onStatusChange={setFilterStatus}
          sort={sort}
          onSortChange={setSort}
          onAddTask={() => handleOpenForm()}
        />

        <div className="flex-1 overflow-x-auto">
          <KanbanBoard
            tasks={tasks}
            categories={categoriesMap}
            loading={tasksLoading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenForm}
          />
        </div>

        {tasksError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
            {tasksError}
          </div>
        )}

        {categoriesError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
            {categoriesError}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          task={editingTask || undefined}
          categories={categories}
          onSave={handleSaveTask}
          onCancel={handleCloseForm}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hide} />
      )}
    </div>
  );
}

export default App;
