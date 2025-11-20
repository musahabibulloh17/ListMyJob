import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { StickyNoteIcon, PlusIcon, EditIcon, TrashIcon, XIcon, SaveIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const NoteManager: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const loadedNotes = await (window as any).electronAPI.getNotes();
      setNotes(loadedNotes);
    }
  };

  const handleSaveNote = async (note: Note) => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      await (window as any).electronAPI.saveNote(note);
      await loadNotes();
      setEditingNote(null);
      setShowForm(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      if (confirm(t('notes.deleteConfirm'))) {
        await (window as any).electronAPI.deleteNote(noteId);
        await loadNotes();
      }
    }
  };


  const noteColors = [
    { name: 'Yellow', value: '#fef3c7' },
    { name: 'Green', value: '#d1fae5' },
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Pink', value: '#fce7f3' },
    { name: 'Orange', value: '#fed7aa' },
  ];

  return (
    <div className="note-manager">
      <div className="note-manager-header">
        <h2>
          <StickyNoteIcon size={24} className="icon-inline" />
          {t('notes.title')}
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingNote(null);
            setShowForm(true);
          }}
        >
          <PlusIcon size={20} />
          {t('notes.new')}
        </button>
      </div>

      {showForm && (
        <div className="note-form">
          <h3>{editingNote ? t('notes.edit') : t('notes.create')}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const note: Note = {
                id: editingNote?.id || Date.now().toString(),
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                color: formData.get('color') as string || '#fef3c7',
                isPinned: editingNote?.isPinned || false,
              };
              handleSaveNote(note);
            }}
          >
            <div className="form-group">
              <label>{t('notes.form.title')}</label>
              <input
                type="text"
                name="title"
                defaultValue={editingNote?.title || ''}
                required
                placeholder={t('notes.form.titlePlaceholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('notes.form.content')}</label>
              <textarea
                name="content"
                defaultValue={editingNote?.content || ''}
                required
                placeholder={t('notes.form.contentPlaceholder')}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>{t('notes.form.color')}</label>
              <div className="color-picker">
                {noteColors.map((color) => (
                  <label key={color.value} className="color-option">
                    <input
                      type="radio"
                      name="color"
                      value={color.value}
                      defaultChecked={editingNote?.color === color.value || (!editingNote && color.value === '#fef3c7')}
                    />
                    <span
                      className="color-swatch"
                      style={{ backgroundColor: color.value }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <SaveIcon size={20} />
                {editingNote ? t('notes.update') : t('notes.create')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
              >
                <XIcon size={20} />
                {t('notes.form.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-grid">
        {notes.length === 0 ? (
          <div className="empty-state">
            <StickyNoteIcon size={64} />
            <h3>{t('notes.empty')}</h3>
            <p>{t('notes.emptyDesc')}</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="note-card"
              style={{ backgroundColor: note.color || '#fef3c7' }}
            >
              <div className="note-card-header">
                <h4>{note.title}</h4>
                <div className="note-card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setEditingNote(note);
                      setShowForm(true);
                    }}
                    title={t('notes.edit')}
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDeleteNote(note.id!)}
                    title={t('notes.delete')}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
              <div className="note-card-content">
                <p>{note.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteManager;

