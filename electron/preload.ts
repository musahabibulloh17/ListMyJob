import { contextBridge, ipcRenderer } from 'electron';

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

contextBridge.exposeInMainWorld('electronAPI', {
  getJobs: (): Promise<Job[]> => ipcRenderer.invoke('get-jobs'),
  saveJob: (job: Job): Promise<Job> => ipcRenderer.invoke('save-job', job),
  deleteJob: (jobId: string): Promise<boolean> => ipcRenderer.invoke('delete-job', jobId),
  showNotification: (title: string, body: string): Promise<boolean> =>
    ipcRenderer.invoke('show-notification', title, body),
});

declare global {
  interface Window {
    electronAPI: {
      getJobs: () => Promise<Job[]>;
      saveJob: (job: Job) => Promise<Job>;
      deleteJob: (jobId: string) => Promise<boolean>;
      showNotification: (title: string, body: string) => Promise<boolean>;
    };
  }
}

