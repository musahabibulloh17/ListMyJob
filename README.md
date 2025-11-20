# 📋 List My Job

> A desktop application that helps you manage and track your jobs with ease. Add jobs, set reminders, and monitor deadlines all in one place. Built with Electron, React, and TypeScript for optimal performance and smooth user experience.

## 📥 Download Installer

**Download the latest installer from [GitHub Releases](https://github.com/musahabibulloh17/ListMyJob/releases)**

## 👨‍💻 Developer

Developed by **[Musa Habibulloh Al Faruq](https://www.linkedin.com/in/musa-habibulloh-al-faruq-370565336/)** - Software Developer

## 📸 Screenshots

### Main Application - List My Job
![List My Job](assets/Screenshot%202025-11-21%20050859.png)

### Pomodoro Timer
![Pomodoro Timer](assets/Screenshot%202025-11-21%20050458.png)

### Sticky Notes
![Sticky Notes](assets/Screenshot%202025-11-21%20050738.png)

### Settings
![Settings](assets/Screenshot%202025-11-21%20051550.png)

## Features

- **Add & Edit Jobs** - Manage your job list with ease
  - Upload images to jobs for visual reference
  - Set reminders and deadlines
  - Track priority and status
- **Reminder/Notifications** - Get desktop notifications when reminder time arrives
- **Deadline Tracking** - Monitor your job deadlines
- **Priority** - Mark jobs with priority (High, Medium, Low)
- **Status Tracking** - Track job status (Pending, In Progress, Completed)
- **Filter** - Filter jobs by status
- **Pomodoro Timer** - Built-in Pomodoro timer with work sessions and breaks
  - 25-minute work sessions
  - 5-minute short breaks
  - 15-minute long breaks (after 4 pomodoros)
  - Visual progress indicator
  - Desktop notifications when timer completes
  - Custom notification audio support
  - Default audio fallback
  - Manual alarm stop button
  - Timer continues running in background when switching menus
- **Sticky Notes** - Create and manage notes
  - Create colorful sticky notes with custom colors
  - Edit and delete notes
  - Organize your notes with different colors
  - Dark mode support
- **Settings** - Customize your application
  - Language selection (English/Indonesian)
  - Theme selection (Light Mode/Dark Mode)
  - Contact information
- **Local Storage** - Data is stored locally on your computer

## Installation & Running

### Prerequisites

- Node.js (version 18 or newer)
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

Run the application in development mode:

```bash
npm run dev
```

This will run:
- Vite dev server for React (http://localhost:5173)
- Electron window connected to the dev server

### Build for Production

Build the application for production and create installer:

**Windows:**
```bash
npm run build:win
```

**Mac:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

**All Platforms:**
```bash
npm run build
```

This will:
- Compile TypeScript
- Build React app
- Package the application into installer (.exe for Windows, .dmg for Mac, .AppImage for Linux)

The installer file will be in the `release/` folder

### Upload Installer to GitHub Releases

To make the installer file appear on GitHub (in the Releases section):

**Method 1: Manual Upload (Easiest)**
1. Build the application: `npm run build:win`
2. Open your GitHub repository in the browser
3. Click the **"Releases"** button in the right sidebar (or visit: `https://github.com/musahabibulloh17/ListMyJob/releases`)
4. Click **"Create a new release"**
5. Fill in:
   - **Tag version**: `v1.0.0` (adjust according to version in package.json)
   - **Release title**: `v1.0.0` or `Release v1.0.0`
   - **Description**: Write changelog or release description
6. In the **"Attach binaries"** section, drag & drop the installer file from the `release/` folder:
   - `List My Job-1.0.0-Setup.exe`
7. Click **"Publish release"**

After that, the installer file will appear on the Releases page and can be downloaded by anyone!

**Method 2: Automatic with GitHub Token (Advanced)**
If you want to automatically upload during build, set the environment variable:
```bash
# Windows PowerShell
$env:GH_TOKEN="your_github_token_here"
npm run build:win -- --publish always
```

**Distribution**: The installer file can be shared directly with friends without needing hosting! See [BUILD.md](./BUILD.md) for full details.

## Project Structure

```
list-my-job/
├── assets/           # Icon files (SVG source and generated icons)
├── electron/         # Electron main process
│   ├── main.ts      # Main process entry point
│   └── preload.ts   # Preload script for IPC
├── scripts/         # Build scripts
│   └── generate-icons.js  # Script to generate icon from SVG
├── src/             # React application
│   ├── components/  # React components
│   │   ├── Icons.tsx      # SVG icon components
│   │   ├── JobForm.tsx    # Form to add/edit job
│   │   ├── JobItem.tsx    # Individual job item
│   │   └── JobList.tsx    # List of all jobs
│   ├── types.ts     # TypeScript types
│   ├── App.tsx      # Main App component
│   ├── main.tsx     # React entry point
│   └── index.css    # Global styles
├── electron-builder.yml  # Electron builder configuration
├── package.json
└── README.md
```

## How to Use

1. **Add New Job**
   - Fill in the "Add New Job" form
   - Enter title (required), description, deadline, and reminder time
   - Select priority and status
   - Click "Save Job"

2. **Edit Job**
   - Click the "Edit" button on the job you want to change
   - Modify the necessary information
   - Click "Update Job"

3. **Change Status**
   - Use the status dropdown on each job item
   - Select status: Pending, In Progress, or Completed

4. **Delete Job**
   - Click the "Delete" button on the job you want to remove
   - Confirm deletion

5. **Filter Jobs**
   - Use the filter tabs above the job list
   - Filter by: All, Pending, In Progress, or Completed

6. **Reminder**
   - Set reminder time when adding/editing a job
   - Desktop notification will appear automatically when the reminder time arrives

7. **Pomodoro Timer**
   - Use the Pomodoro timer at the top of the app to focus on your work
   - Select between Work, Short Break, or Long Break modes
   - Click Start to begin the timer
   - The timer will automatically switch to break mode after a work session
   - After 4 completed pomodoros, you'll get a long break
   - Desktop notifications will alert you when each session completes

8. **Sticky Notes**
   - Create sticky notes in the Notes section
   - Choose from multiple colors (Yellow, Green, Blue, Pink, Orange)
   - Edit and delete notes as needed
   - Notes are saved locally and persist between app restarts

## Technologies Used

- **Electron** - Framework for desktop applications
- **React** - Library for UI
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **date-fns** - Library for date manipulation

## Notes

- Job data is stored in `%APPDATA%/list-my-job/jobs.json` (Windows)
- Notifications only appear if the application is running
- Reminders are checked every 1 minute

## License

MIT
