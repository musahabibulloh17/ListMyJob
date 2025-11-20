import React, { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import { Job } from './types';
import { ListIcon, ClockIcon, PlayIcon, CheckIcon } from './components/Icons';

function App() {
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
    if (window.electronAPI && confirm('Apakah Anda yakin ingin menghapus job ini?')) {
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

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>
          <ListIcon size={32} color="white" className="icon-inline-header" />
          List My Job
        </h1>
        <p>Kelola dan ingatkan pekerjaan Anda dengan mudah</p>
      </div>
      <div className="app-content">
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
              Semua ({jobs.length})
            </span>
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <span>
              <ClockIcon size={16} className="icon-inline-small" />
              Pending ({jobs.filter((j) => j.status === 'pending').length})
            </span>
          </button>
          <button
            className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            <span>
              <PlayIcon size={16} className="icon-inline-small" />
              In Progress ({jobs.filter((j) => j.status === 'in-progress').length})
            </span>
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <span>
              <CheckIcon size={16} className="icon-inline-small" />
              Completed ({jobs.filter((j) => j.status === 'completed').length})
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

export default App;

