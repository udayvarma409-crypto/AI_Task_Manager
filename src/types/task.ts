export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
}
