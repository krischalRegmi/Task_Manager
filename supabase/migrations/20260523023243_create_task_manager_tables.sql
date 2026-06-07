/*
  # Create Task Manager Tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `color` (text, color code for UI)
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `status` (text, enum: 'todo', 'in_progress', 'done')
      - `priority` (text, enum: 'low', 'medium', 'high')
      - `category_id` (uuid, foreign key to categories, optional)
      - `due_date` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add public select/insert/update/delete policies (no auth required)
    - All public users can read and modify tasks
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public policies for categories (anyone can read, insert, update, delete)
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are publicly insertable"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Categories are publicly updatable"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Categories are publicly deletable"
  ON categories FOR DELETE
  TO public
  USING (true);

-- Enable RLS on tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Public policies for tasks (anyone can read, insert, update, delete)
CREATE POLICY "Tasks are publicly readable"
  ON tasks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Tasks are publicly insertable"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Tasks are publicly updatable"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tasks are publicly deletable"
  ON tasks FOR DELETE
  TO public
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
