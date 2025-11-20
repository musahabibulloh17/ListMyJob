import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { XIcon, EditIcon, SaveIcon } from './Icons';

const StickyNote: React.FC = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Try loading with retry mechanism
    const loadWithRetry = async (retries = 5) => {
      for (let i = 0; i < retries; i++) {
        try {
          if (typeof window !== 'undefined' && (window as any).electronAPI) {
            const noteData = await (window as any).electronAPI.getStickyNoteData();
            if (noteData) {
              setNote(noteData);
              setTitle(noteData.title);
              setContent(noteData.content);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading note data:', error);
        }
        
        // Wait before retry
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // If still no data, try getting noteId from URL
      const urlParams = new URLSearchParams(window.location.search);
      const noteId = urlParams.get('noteId');
      if (noteId && typeof window !== 'undefined' && (window as any).electronAPI) {
        // Try to get all notes and find the one with matching ID
        try {
          const allNotes = await (window as any).electronAPI.getNotes();
          const foundNote = allNotes.find((n: Note) => n.id === noteId);
          if (foundNote) {
            setNote(foundNote);
            setTitle(foundNote.title);
            setContent(foundNote.content);
          }
        } catch (error) {
          console.error('Error loading notes:', error);
        }
      }
    };
    
    loadWithRetry();
  }, []);

  const handleSave = async () => {
    if (note && typeof window !== 'undefined' && (window as any).electronAPI) {
      const updatedNote: Note = {
        ...note,
        title,
        content,
        updatedAt: new Date().toISOString(),
      };
      await (window as any).electronAPI.saveNote(updatedNote);
      setNote(updatedNote);
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.close) {
      window.close();
    }
  };

  if (!note) {
    return (
      <div className="sticky-note-container">
        <div className="sticky-note-loading">Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    // Add class to body for sticky note window
    document.body.classList.add('sticky-note-window');
    return () => {
      document.body.classList.remove('sticky-note-window');
    };
  }, []);

  return (
    <div
      className="sticky-note-container"
      style={{ 
        backgroundColor: note.color || '#fef3c7',
      }}
    >
      <div className="sticky-note-inner">
        <div className="sticky-note-header">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sticky-note-title-input"
            placeholder="Note title..."
            autoFocus
          />
        ) : (
          <h3 className="sticky-note-title">{note.title}</h3>
        )}
        <div className="sticky-note-actions">
          {isEditing ? (
            <button
              className="sticky-note-btn"
              onClick={handleSave}
              title="Save"
            >
              <SaveIcon size={16} />
            </button>
          ) : (
            <button
              className="sticky-note-btn"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <EditIcon size={16} />
            </button>
          )}
          <button
            className="sticky-note-btn"
            onClick={handleClose}
            title="Close"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>
      <div className="sticky-note-content">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="sticky-note-content-input"
            placeholder="Note content..."
            autoFocus
          />
        ) : (
          <p>{note.content}</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default StickyNote;

