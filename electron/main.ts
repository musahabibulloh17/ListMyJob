import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const isDev = process.env.NODE_ENV === 'development' || 
              process.defaultApp || 
              /[\\/]electron/.test(process.execPath) ||
              !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
const stickyNoteWindows = new Map<string, BrowserWindow>();
const jobsFilePath = path.join(app.getPath('userData'), 'jobs.json');
const notesFilePath = path.join(app.getPath('userData'), 'notes.json');

function loadJobs(): any[] {
  try {
    if (existsSync(jobsFilePath)) {
      const data = readFileSync(jobsFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
  return [];
}

function saveJobs(jobs: any[]): void {
  try {
    writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving jobs:', error);
  }
}

function loadNotes(): any[] {
  try {
    if (existsSync(notesFilePath)) {
      const data = readFileSync(notesFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading notes:', error);
  }
  return [];
}

function saveNotes(notes: any[]): void {
  try {
    writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving notes:', error);
  }
}

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const iconExists = existsSync(iconPath);
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...(iconExists && { icon: iconPath }),
    title: 'List My Job',
    backgroundColor: '#f5f5f5',
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const appPath = app.getAppPath();
    const htmlPath = path.join(appPath, 'dist', 'index.html');
    
    mainWindow.loadFile(htmlPath).catch((error) => {
      console.error('Error loading file:', error);
      if (mainWindow) {
        const altPath = path.join(__dirname, '..', 'dist', 'index.html');
        mainWindow.loadFile(altPath);
      }
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-jobs', () => {
  return loadJobs();
});

ipcMain.handle('save-job', (_, job: any) => {
  const jobs = loadJobs();
  const newJob = {
    ...job,
    id: job.id || Date.now().toString(),
    createdAt: job.createdAt || new Date().toISOString(),
  };
  
  const existingIndex = jobs.findIndex((j: any) => j.id === newJob.id);
  if (existingIndex >= 0) {
    jobs[existingIndex] = newJob;
  } else {
    jobs.push(newJob);
  }
  
  saveJobs(jobs);
  return newJob;
});

ipcMain.handle('delete-job', (_, jobId: string) => {
  const jobs = loadJobs();
  const filtered = jobs.filter((j: any) => j.id !== jobId);
  saveJobs(filtered);
  return true;
});

ipcMain.handle('show-notification', (_, title: string, body: string) => {
  if (Notification.isSupported()) {
    const iconPath = path.join(__dirname, '../assets/icon.png');
    const notificationOptions: Electron.NotificationConstructorOptions = {
      title,
      body,
    };
    if (existsSync(iconPath)) {
      notificationOptions.icon = iconPath;
    }
    const notification = new Notification(notificationOptions);
    notification.show();
    return true;
  }
  return false;
});

// Notes IPC Handlers
ipcMain.handle('get-notes', () => {
  return loadNotes();
});

ipcMain.handle('save-note', (_, note: any) => {
  const notes = loadNotes();
  const newNote = {
    ...note,
    id: note.id || Date.now().toString(),
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const existingIndex = notes.findIndex((n: any) => n.id === newNote.id);
  if (existingIndex >= 0) {
    notes[existingIndex] = newNote;
  } else {
    notes.push(newNote);
  }
  
  saveNotes(notes);
  return newNote;
});

ipcMain.handle('delete-note', (_, noteId: string) => {
  const notes = loadNotes();
  const filtered = notes.filter((n: any) => n.id !== noteId);
  saveNotes(filtered);
  
  // Close sticky note window if open
  if (stickyNoteWindows.has(noteId)) {
    const window = stickyNoteWindows.get(noteId);
    if (window) {
      window.close();
    }
    stickyNoteWindows.delete(noteId);
  }
  
  return true;
});

ipcMain.handle('create-sticky-note-window', (_, noteId: string) => {
  // Close existing window if open
  if (stickyNoteWindows.has(noteId)) {
    const existingWindow = stickyNoteWindows.get(noteId);
    if (existingWindow) {
      existingWindow.close();
    }
  }

  const notes = loadNotes();
  const note = notes.find((n: any) => n.id === noteId);
  if (!note) return false;

  const iconPath = path.join(__dirname, '../assets/icon.png');
  const iconExists = existsSync(iconPath);

  const stickyWindow = new BrowserWindow({
    width: note.size?.width || 300,
    height: note.size?.height || 250,
    x: note.position?.x || 100,
    y: note.position?.y || 100,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
    ...(iconExists && { icon: iconPath }),
    title: note.title || 'Sticky Note',
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    minimizable: false,
    maximizable: false,
    hasShadow: true,
    backgroundColor: '#00000000', // Fully transparent background
  });

  // Store note ID in window BEFORE loading
  (stickyWindow as any).noteId = noteId;

  // Wait for window to be ready before loading
  stickyWindow.once('ready-to-show', () => {
    // Ensure noteId is still set
    (stickyWindow as any).noteId = noteId;
  });

  if (isDev) {
    stickyWindow.loadURL(`http://localhost:5173?noteId=${noteId}&type=sticky`);
  } else {
    stickyWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), {
      query: { noteId, type: 'sticky' }
    });
  }

  stickyWindow.on('closed', () => {
    stickyNoteWindows.delete(noteId);
  });

  stickyWindow.on('moved', () => {
    const bounds = stickyWindow.getBounds();
    const notes = loadNotes();
    const noteIndex = notes.findIndex((n: any) => n.id === noteId);
    if (noteIndex >= 0) {
      notes[noteIndex].position = { x: bounds.x, y: bounds.y };
      saveNotes(notes);
    }
  });

  stickyWindow.on('resized', () => {
    const bounds = stickyWindow.getBounds();
    const notes = loadNotes();
    const noteIndex = notes.findIndex((n: any) => n.id === noteId);
    if (noteIndex >= 0) {
      notes[noteIndex].size = { width: bounds.width, height: bounds.height };
      saveNotes(notes);
    }
  });

  stickyNoteWindows.set(noteId, stickyWindow);
  return true;
});

ipcMain.handle('close-sticky-note-window', (_, noteId: string) => {
  if (stickyNoteWindows.has(noteId)) {
    const window = stickyNoteWindows.get(noteId);
    if (window) {
      window.close();
    }
    stickyNoteWindows.delete(noteId);
    return true;
  }
  return false;
});

ipcMain.handle('get-window-type', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return 'main';
  
  const url = event.sender.getURL();
  if (url.includes('type=sticky')) {
    return 'sticky';
  }
  return 'main';
});

ipcMain.handle('get-sticky-note-data', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) {
    console.error('get-sticky-note-data: Window not found');
    return null;
  }
  
  let noteId = (window as any).noteId;
  
  // If noteId not found in window, try to get from URL
  if (!noteId) {
    const url = event.sender.getURL();
    const urlMatch = url.match(/[?&]noteId=([^&]+)/);
    if (urlMatch) {
      noteId = urlMatch[1];
      (window as any).noteId = noteId; // Store it for next time
    }
  }
  
  if (!noteId) {
    console.error('get-sticky-note-data: NoteId not found');
    return null;
  }

  const notes = loadNotes();
  const foundNote = notes.find((n: any) => n.id === noteId);
  
  if (!foundNote) {
    console.error('get-sticky-note-data: Note not found with id:', noteId);
    console.log('Available notes:', notes.map((n: any) => n.id));
  }
  
  return foundNote || null;
});

// Window controls
ipcMain.handle('window-minimize', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.close();
  }
});

ipcMain.handle('window-is-maximized', () => {
  const window = BrowserWindow.getFocusedWindow();
  return window ? window.isMaximized() : false;
});

// Check reminder setiap menit
setInterval(() => {
  const jobs = loadJobs();
  const now = new Date();
  
  jobs.forEach((job: any) => {
    if (job.reminderTime && !job.notified) {
      const reminderTime = new Date(job.reminderTime);
      const timeDiff = reminderTime.getTime() - now.getTime();
      
      if (timeDiff <= 60000 && timeDiff >= 0) {
        if (mainWindow && Notification.isSupported()) {
          const iconPath = path.join(__dirname, '../assets/icon.png');
          const notificationOptions: Electron.NotificationConstructorOptions = {
            title: 'Reminder: Job Mendekati Deadline!',
            body: `${job.title} - ${job.description || 'Tidak ada deskripsi'}`,
          };
          if (existsSync(iconPath)) {
            notificationOptions.icon = iconPath;
          }
          const notification = new Notification(notificationOptions);
          notification.show();
          
          job.notified = true;
          saveJobs(jobs);
        }
      }
    }
  });
}, 60000);

