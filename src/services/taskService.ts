import { supabase } from '../lib/supabase';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function getTasks(status?: string, priority?: string): Promise<Task[]> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);

  const url = `${FUNCTIONS_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const data = await response.json();
  return data.tasks;
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${FUNCTIONS_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }

  const data = await response.json();
  return data.task;
}

export async function updateTask(taskId: string, taskData: UpdateTaskData): Promise<Task> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${FUNCTIONS_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const data = await response.json();
  return data.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${FUNCTIONS_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

export async function suggestPriority(title: string, description?: string): Promise<{ priority: 'low' | 'medium' | 'high'; explanation: string }> {
  const response = await fetch(`${FUNCTIONS_URL}/suggest-priority`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error('Failed to get priority suggestion');
  }

  return await response.json();
}
