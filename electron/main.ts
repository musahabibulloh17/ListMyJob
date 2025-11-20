import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const isDev = process.env.NODE_ENV === 'development' || 
              process.defaultApp || 
              /[\\/]electron/.test(process.execPath) ||
              !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
const jobsFilePath = path.join(app.getPath('userData'), 'jobs.json');

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

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const iconExists = existsSync(iconPath);
  
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...(iconExists && { icon: iconPath }),
    title: 'List My Job',
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

