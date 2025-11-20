import React from 'react';
import { Job } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { ClockIcon, PlayIcon, CheckIcon, EditIcon, TrashIcon, CalendarIcon, BellIcon, FileTextIcon, AlertIcon } from './Icons';

interface JobItemProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (job: Job) => void;
}

const JobItem: React.FC<JobItemProps> = ({ job, onEdit, onDelete, onStatusChange }) => {
  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return 'Sedang';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'Sedang Dikerjakan';
      case 'completed':
        return 'Selesai';
      default:
        return 'Pending';
    }
  };

  const handleStatusChange = (newStatus: Job['status']) => {
    onStatusChange({ ...job, status: newStatus });
  };

  const isOverdue = job.deadline && new Date(job.deadline) < new Date() && job.status !== 'completed';

  return (
    <div className={`job-item ${job.status === 'completed' ? 'completed' : ''}`}>
      <div className="job-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
            <span className={`priority-badge priority-${job.priority || 'medium'}`}>
              {getPriorityLabel(job.priority)}
            </span>
            <span className={`status-badge status-${job.status || 'pending'}`}>
              {getStatusLabel(job.status)}
            </span>
            {isOverdue && (
              <span className="overdue-badge">
                <AlertIcon size={16} color="#dc3545" />
                Terlambat!
              </span>
            )}
          </div>
        </div>
      </div>

      {job.description && (
        <p className="job-description">{job.description}</p>
      )}

      <div className="job-meta">
        {job.deadline && (
          <div className="job-meta-item">
            <strong>
              <CalendarIcon size={14} />
              Deadline:
            </strong>
            <span className={isOverdue ? 'overdue-text' : ''}>
              {format(new Date(job.deadline), 'dd MMM yyyy, HH:mm', { locale: id })}
              {!isOverdue && ` (${formatDistanceToNow(new Date(job.deadline), { addSuffix: true, locale: id })})`}
            </span>
          </div>
        )}
        {job.reminderTime && (
          <div className="job-meta-item">
            <strong>
              <BellIcon size={14} />
              Reminder:
            </strong>
            <span>
              {format(new Date(job.reminderTime), 'dd MMM yyyy, HH:mm', { locale: id })}
            </span>
          </div>
        )}
        {job.createdAt && (
          <div className="job-meta-item">
            <strong>
              <FileTextIcon size={14} />
              Dibuat:
            </strong>
            <span>{format(new Date(job.createdAt), 'dd MMM yyyy', { locale: id })}</span>
          </div>
        )}
      </div>

      <div className="job-actions">
        <select
          value={job.status || 'pending'}
          onChange={(e) => handleStatusChange(e.target.value as Job['status'])}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn btn-primary" onClick={() => onEdit(job)}>
          <EditIcon size={18} />
          <span>Edit</span>
        </button>
        <button className="btn btn-danger" onClick={() => job.id && onDelete(job.id)}>
          <TrashIcon size={18} />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
};

export default JobItem;

