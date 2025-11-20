import React, { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import PomodoroTimer from './components/PomodoroTimer';
import NoteManager from './components/NoteManager';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import WindowControls from './components/WindowControls';
import { Job } from './types';
import { ListIcon, ClockIcon, PlayIcon, CheckIcon, TimerIcon, StickyNoteIcon, SettingsIcon } from './components/Icons';
import { useLanguage } from './contexts/LanguageContext';

type MenuType = 'jobs' | 'pomodoro' | 'notes' | 'settings';

function App() {
  const { t } = useLanguage();
  const [activeMenu, setActiveMenu] = useState<MenuType>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    if (window.electronAPI) {
      const loadedJobs = await window.electronAPI.getJobs();
      setJobs(loadedJobs);
    }
  };

  const handleSaveJob = async (job: Job) => {
    if (window.electronAPI) {
      const savedJob = await window.electronAPI.saveJob(job);
      await loadJobs();
      setEditingJob(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.electronAPI && confirm(t('jobs.deleteConfirm'))) {
      await window.electronAPI.deleteJob(jobId);
      await loadJobs();
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const renderContent = () => {
    switch (activeMenu) {
      case 'pomodoro':
        return (
          <div className="menu-content">
            <div className="menu-header">
              <h1>
                <TimerIcon size={24} className="icon-inline-header" />
                {t('pomodoro.title')}
              </h1>
              <p>{t('pomodoro.subtitle')}</p>
            </div>
            <div className="menu-body">
              <PomodoroTimer />
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="menu-content">
            <div className="menu-header">
              <h1>
                <StickyNoteIcon size={24} className="icon-inline-header" />
                {t('notes.title')}
              </h1>
              <p>{t('notes.subtitle')}</p>
            </div>
            <div className="menu-body">
              <NoteManager />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="menu-content">
            <div className="menu-header">
              <h1>
                <SettingsIcon size={24} className="icon-inline-header" />
                {t('settings.title')}
              </h1>
              <p>{t('settings.subtitle')}</p>
            </div>
            <div className="menu-body">
              <Settings />
            </div>
          </div>
        );
      
      case 'jobs':
      default:
        return (
          <div className="menu-content">
            <div className="menu-header">
              <h1>
                <ListIcon size={24} className="icon-inline-header" />
                {t('jobs.title')}
              </h1>
              <p>{t('jobs.subtitle')}</p>
            </div>
            <div className="menu-body">
              <JobForm
                job={editingJob}
                onSave={handleSaveJob}
                onCancel={() => setEditingJob(null)}
              />
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  <span>
                    <ListIcon size={16} className="icon-inline-small" />
                    {t('jobs.filter.all')} ({jobs.length})
                  </span>
                </button>
                <button
                  className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  <span>
                    <ClockIcon size={16} className="icon-inline-small" />
                    {t('jobs.filter.pending')} ({jobs.filter((j) => j.status === 'pending').length})
                  </span>
                </button>
                <button
                  className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setFilter('in-progress')}
                >
                  <span>
                    <PlayIcon size={16} className="icon-inline-small" />
                    {t('jobs.filter.inProgress')} ({jobs.filter((j) => j.status === 'in-progress').length})
                  </span>
                </button>
                <button
                  className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  <span>
                    <CheckIcon size={16} className="icon-inline-small" />
                    {t('jobs.filter.completed')} ({jobs.filter((j) => j.status === 'completed').length})
                  </span>
                </button>
              </div>
              <JobList
                jobs={filteredJobs}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
                onStatusChange={handleSaveJob}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="title-bar">
        <div className="title-bar-drag-region"></div>
        <div className="title-bar-content">
          <span className="title-bar-title">List My Job</span>
        </div>
        <WindowControls />
      </div>
      <div className="app-body">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="app-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;

