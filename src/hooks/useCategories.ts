import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();

    const subscription = supabase
      .channel('categories-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchCategories();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (err) throw err;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, color: string) => {
    try {
      const { data, error: err } = await supabase
        .from('categories')
        .insert([{ name, color }])
        .select()
        .single();

      if (err) throw err;
      setCategories([...categories, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete category');
    }
  };

  return { categories, loading, error, createCategory, deleteCategory, refetch: fetchCategories };
}
