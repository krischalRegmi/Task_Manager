import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskFilters } from '../types';

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();

    const subscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filters?.status, filters?.priority, filters?.category_id, filters?.search, filters?.sort]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.sort === 'due_date') {
        query = query.order('due_date', { ascending: true, nullsFirst: false });
      } else if (filters?.sort === 'priority') {
        query = query.order('priority', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: err } = await query;

      if (err) throw err;
      setTasks(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .insert([{ ...task, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (err) throw err;
      setTasks([data, ...tasks]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      setTasks(tasks.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete task');
    }
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}
