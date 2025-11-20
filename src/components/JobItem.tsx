import React from 'react';
import { Job } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { ClockIcon, PlayIcon, CheckIcon, EditIcon, TrashIcon, CalendarIcon, BellIcon, FileTextIcon, AlertIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface JobItemProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (job: Job) => void;
}

const JobItem: React.FC<JobItemProps> = ({ job, onEdit, onDelete, onStatusChange }) => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'id' ? id : enUS;
  
  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high':
        return t('jobs.item.priority.high');
      case 'medium':
        return t('jobs.item.priority.medium');
      case 'low':
        return t('jobs.item.priority.low');
      default:
        return t('jobs.item.priority.medium');
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending':
        return t('jobs.item.status.pending');
      case 'in-progress':
        return t('jobs.item.status.inProgress');
      case 'completed':
        return t('jobs.item.status.completed');
      default:
        return t('jobs.item.status.pending');
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
                {t('jobs.item.overdue')}
              </span>
            )}
          </div>
        </div>
      </div>

      {job.imagePath && (
        <div className="job-image-container">
          <img 
            src={`job-image://${job.imagePath.replace(/\\/g, '/')}`} 
            alt={job.title}
            className="job-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {job.description && (
        <p className="job-description">{job.description}</p>
      )}

      <div className="job-meta">
        {job.deadline && (
          <div className="job-meta-item">
            <strong>
              <CalendarIcon size={14} />
              {t('jobs.item.deadline')}
            </strong>
            <span className={isOverdue ? 'overdue-text' : ''}>
              {format(new Date(job.deadline), 'dd MMM yyyy, HH:mm', { locale: dateLocale })}
              {!isOverdue && ` (${formatDistanceToNow(new Date(job.deadline), { addSuffix: true, locale: dateLocale })})`}
            </span>
          </div>
        )}
        {job.reminderTime && (
          <div className="job-meta-item">
            <strong>
              <BellIcon size={14} />
              {t('jobs.item.reminder')}
            </strong>
            <span>
              {format(new Date(job.reminderTime), 'dd MMM yyyy, HH:mm', { locale: dateLocale })}
            </span>
          </div>
        )}
        {job.createdAt && (
          <div className="job-meta-item">
            <strong>
              <FileTextIcon size={14} />
              {t('jobs.item.created')}
            </strong>
            <span>{format(new Date(job.createdAt), 'dd MMM yyyy', { locale: dateLocale })}</span>
          </div>
        )}
      </div>

      <div className="job-actions">
        <select
          value={job.status || 'pending'}
          onChange={(e) => handleStatusChange(e.target.value as Job['status'])}
        >
          <option value="pending">{t('jobs.form.status.pending')}</option>
          <option value="in-progress">{t('jobs.form.status.inProgress')}</option>
          <option value="completed">{t('jobs.form.status.completed')}</option>
        </select>
        <button className="btn btn-primary" onClick={() => onEdit(job)}>
          <EditIcon size={18} />
          <span>{t('jobs.item.edit')}</span>
        </button>
        <button className="btn btn-danger" onClick={() => job.id && onDelete(job.id)}>
          <TrashIcon size={18} />
          <span>{t('jobs.item.delete')}</span>
        </button>
      </div>
    </div>
  );
};

export default JobItem;

