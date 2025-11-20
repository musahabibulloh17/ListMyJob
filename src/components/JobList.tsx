import React from 'react';
import JobItem from './JobItem';
import { Job } from '../types';
import { ListIcon } from './Icons';

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3>Belum ada job</h3>
        <p>Tambahkan job pertama Anda untuk memulai!</p>
      </div>
    );
  }

  // Sort jobs: high priority first, then by deadline
  const sortedJobs = [...jobs].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityOrder[b.priority || 'medium'] || 0) - (priorityOrder[a.priority || 'medium'] || 0);
    if (priorityDiff !== 0) return priorityDiff;
    
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });

  return (
    <div className="job-list">
      <h2>
        <ListIcon size={24} className="icon-inline" />
        Daftar Job <span className="job-count">({jobs.length} job)</span>
      </h2>
      {sortedJobs.map((job) => (
        <JobItem
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default JobList;

