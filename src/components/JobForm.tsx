import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { format } from 'date-fns';
import { EditIcon, PlusIcon, SaveIcon, XIcon, UploadIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface JobFormProps {
  job?: Job | null;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Job>({
    title: '',
    description: '',
    deadline: '',
    reminderTime: '',
    priority: 'medium',
    status: 'pending',
    imagePath: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        deadline: job.deadline ? format(new Date(job.deadline), "yyyy-MM-dd'T'HH:mm") : '',
        reminderTime: job.reminderTime ? format(new Date(job.reminderTime), "yyyy-MM-dd'T'HH:mm") : '',
      });
      if (job.imagePath) {
        const imageUrl = `job-image://${job.imagePath.replace(/\\/g, '/')}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        reminderTime: '',
        priority: 'medium',
        status: 'pending',
        imagePath: '',
      });
      setImagePreview(null);
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert(t('jobs.form.titleRequired'));
      return;
    }

    const jobToSave: Job = {
      ...formData,
      id: job?.id,
      createdAt: job?.createdAt || new Date().toISOString(),
    };

    onSave(jobToSave);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async () => {
    if (typeof window === 'undefined' || !(window as any).electronAPI) return;
    
    setIsUploadingImage(true);
    try {
      const imagePath = await (window as any).electronAPI.uploadJobImage();
      if (imagePath) {
        setFormData((prev) => ({ ...prev, imagePath }));
        const imageUrl = `job-image://${imagePath.replace(/\\/g, '/')}`;
        setImagePreview(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.imagePath && typeof window !== 'undefined' && (window as any).electronAPI) {
      await (window as any).electronAPI.deleteJobImage(formData.imagePath);
    }
    setFormData((prev) => ({ ...prev, imagePath: '' }));
    setImagePreview(null);
  };

  return (
    <div className="job-form">
      <h2>
        {job ? (
          <>
            <EditIcon size={24} className="icon-inline" />
            {t('jobs.edit')}
          </>
        ) : (
          <>
            <PlusIcon size={24} className="icon-inline" />
            {t('jobs.add')}
          </>
        )}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">{t('jobs.form.title')} *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('jobs.form.titlePlaceholder')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">{t('jobs.form.description')}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('jobs.form.descriptionPlaceholder')}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deadline">{t('jobs.form.deadline')}</label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reminderTime">{t('jobs.form.reminderTime')}</label>
            <input
              type="datetime-local"
              id="reminderTime"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#6c757d' }}>
              {t('jobs.form.reminderHint')}
            </small>
          </div>
        </div>

        <div className="form-group">
          <label>{t('jobs.form.image')}</label>
          <div className="image-upload-section">
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Job preview" className="image-preview" />
                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  onClick={handleRemoveImage}
                >
                  <XIcon size={16} />
                  {t('jobs.form.removeImage')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-upload-image"
                onClick={handleUploadImage}
                disabled={isUploadingImage}
              >
                <UploadIcon size={18} />
                {isUploadingImage ? t('jobs.form.uploadingImage') : t('jobs.form.uploadImage')}
              </button>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">{t('jobs.form.priority')}</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">{t('jobs.form.priority.low')}</option>
              <option value="medium">{t('jobs.form.priority.medium')}</option>
              <option value="high">{t('jobs.form.priority.high')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">{t('jobs.form.status')}</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">{t('jobs.form.status.pending')}</option>
              <option value="in-progress">{t('jobs.form.status.inProgress')}</option>
              <option value="completed">{t('jobs.form.status.completed')}</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {job ? (
              <>
                <SaveIcon size={18} />
                <span>{t('jobs.update')}</span>
              </>
            ) : (
              <>
                <PlusIcon size={18} />
                <span>{t('jobs.save')}</span>
              </>
            )}
          </button>
          {job && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <XIcon size={18} />
              <span>{t('jobs.form.cancel')}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobForm;

