import { Task, TaskStatus, Category } from '../types';
import { TaskCard } from './TaskCard';
import { Loader2 } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  categories: Map<string, Category>;
  loading: boolean;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export function KanbanBoard({
  tasks,
  categories,
  loading,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
}: KanbanBoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full">
      {statuses.map(({ value, label }) => {
        const columnTasks = getTasksByStatus(value);

        return (
          <div
            key={value}
            className="flex-shrink-0 w-96 bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div
              className="space-y-3 min-h-96"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                try {
                  const taskId = e.dataTransfer.getData('taskId');
                  if (taskId) {
                    onUpdateTask(taskId, { status: value });
                  }
                } catch (error) {
                  console.error('Drop failed:', error);
                }
              }}
            >
              {loading && columnTasks.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="text-gray-400 animate-spin" />
                </div>
              ) : columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks yet
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      category={task.category_id ? categories.get(task.category_id) : undefined}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
