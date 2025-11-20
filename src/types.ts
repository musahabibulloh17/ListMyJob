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
  imagePath?: string;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  color?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

