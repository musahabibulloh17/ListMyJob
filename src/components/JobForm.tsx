import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { format } from 'date-fns';
import { EditIcon, PlusIcon, SaveIcon, XIcon } from './Icons';

interface JobFormProps {
  job?: Job | null;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Job>({
    title: '',
    description: '',
    deadline: '',
    reminderTime: '',
    priority: 'medium',
    status: 'pending',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        deadline: job.deadline ? format(new Date(job.deadline), "yyyy-MM-dd'T'HH:mm") : '',
        reminderTime: job.reminderTime ? format(new Date(job.reminderTime), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        reminderTime: '',
        priority: 'medium',
        status: 'pending',
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul job harus diisi!');
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

  return (
    <div className="job-form">
      <h2>
        {job ? (
          <>
            <EditIcon size={24} className="icon-inline" />
            Edit Job
          </>
        ) : (
          <>
            <PlusIcon size={24} className="icon-inline" />
            Tambah Job Baru
          </>
        )}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Judul Job *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Review kode aplikasi"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tambahkan detail tentang job ini..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reminderTime">Waktu Reminder</label>
            <input
              type="datetime-local"
              id="reminderTime"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#6c757d' }}>
              Notifikasi akan muncul saat waktu reminder tiba
            </small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Prioritas</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {job ? (
              <>
                <SaveIcon size={18} />
                <span>Update Job</span>
              </>
            ) : (
              <>
                <PlusIcon size={18} />
                <span>Simpan Job</span>
              </>
            )}
          </button>
          {job && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <XIcon size={18} />
              <span>Batal</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobForm;

