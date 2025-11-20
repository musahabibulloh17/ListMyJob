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

contextBridge.exposeInMainWorld('electronAPI', {
  getJobs: (): Promise<Job[]> => ipcRenderer.invoke('get-jobs'),
  saveJob: (job: Job): Promise<Job> => ipcRenderer.invoke('save-job', job),
  deleteJob: (jobId: string): Promise<boolean> => ipcRenderer.invoke('delete-job', jobId),
  showNotification: (title: string, body: string): Promise<boolean> =>
    ipcRenderer.invoke('show-notification', title, body),
  // Notes API
  getNotes: (): Promise<Note[]> => ipcRenderer.invoke('get-notes'),
  saveNote: (note: Note): Promise<Note> => ipcRenderer.invoke('save-note', note),
  deleteNote: (noteId: string): Promise<boolean> => ipcRenderer.invoke('delete-note', noteId),
  // Window management
  createStickyNoteWindow: (noteId: string): Promise<boolean> => 
    ipcRenderer.invoke('create-sticky-note-window', noteId),
  closeStickyNoteWindow: (noteId: string): Promise<boolean> => 
    ipcRenderer.invoke('close-sticky-note-window', noteId),
  // Get current window type
  getWindowType: (): Promise<string> => ipcRenderer.invoke('get-window-type'),
  // Get note data for sticky window
  getStickyNoteData: (): Promise<Note | null> => ipcRenderer.invoke('get-sticky-note-data'),
  // Window controls
  windowMinimize: (): Promise<void> => ipcRenderer.invoke('window-minimize'),
  windowMaximize: (): Promise<void> => ipcRenderer.invoke('window-maximize'),
  windowClose: (): Promise<void> => ipcRenderer.invoke('window-close'),
  windowIsMaximized: (): Promise<boolean> => ipcRenderer.invoke('window-is-maximized'),
  // Pomodoro Notification Audio
  uploadNotificationAudio: (): Promise<string | null> => ipcRenderer.invoke('upload-notification-audio'),
  getNotificationAudioPath: (): Promise<string | null> => ipcRenderer.invoke('get-notification-audio-path'),
  deleteNotificationAudio: (): Promise<boolean> => ipcRenderer.invoke('delete-notification-audio'),
  playNotificationAudio: (): Promise<string | null> => ipcRenderer.invoke('play-notification-audio'),
  // Job Image API
  uploadJobImage: (): Promise<string | null> => ipcRenderer.invoke('upload-job-image'),
  deleteJobImage: (imagePath: string): Promise<boolean> => ipcRenderer.invoke('delete-job-image', imagePath),
});

declare global {
  interface Window {
    electronAPI: {
      getJobs: () => Promise<Job[]>;
      saveJob: (job: Job) => Promise<Job>;
      deleteJob: (jobId: string) => Promise<boolean>;
      showNotification: (title: string, body: string) => Promise<boolean>;
      getNotes: () => Promise<Note[]>;
      saveNote: (note: Note) => Promise<Note>;
      deleteNote: (noteId: string) => Promise<boolean>;
      createStickyNoteWindow: (noteId: string) => Promise<boolean>;
      closeStickyNoteWindow: (noteId: string) => Promise<boolean>;
      getWindowType: () => Promise<string>;
      getStickyNoteData: () => Promise<Note | null>;
      windowMinimize: () => Promise<void>;
      windowMaximize: () => Promise<void>;
      windowClose: () => Promise<void>;
      windowIsMaximized: () => Promise<boolean>;
      uploadNotificationAudio: () => Promise<string | null>;
      getNotificationAudioPath: () => Promise<string | null>;
      deleteNotificationAudio: () => Promise<boolean>;
      playNotificationAudio: () => Promise<string | null>;
      uploadJobImage: () => Promise<string | null>;
      deleteJobImage: (imagePath: string) => Promise<boolean>;
    };
  }
}

