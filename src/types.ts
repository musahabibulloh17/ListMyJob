export interface Job {
  id?: string;
  title: string;
  description?: string;
  deadline?: string;
  reminderTime?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
  notified?: boolean;
}

