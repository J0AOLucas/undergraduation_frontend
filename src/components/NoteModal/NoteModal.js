'use client';

import { useState } from 'react';
import styles from './noteModal.module.css';
import api from '@/services/api';

export default function NoteModal({ isOpen, onClose, studentId, onNoteAdded }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter a note');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const noteData = {
        content: content.trim(),
        student_id: studentId,
        author: 'admin123' // TODO: Get from auth context
      };

      await api.createNote(noteData);
      
      setSuccess(true);
      setContent('');
      
      // Call callback to refresh notes
      if (onNoteAdded) {
        onNoteAdded();
      }
      
      // Close modal after 1 second
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000);
      
    } catch (err) {
      console.error('Failed to create note:', err);
      setError('Failed to create note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setContent('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Internal Note</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={isLoading}
          >
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            {success && (
              <div className={styles.successMessage}>
                Note created successfully!
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Note Content
              </label>
              <textarea
                className={styles.formTextarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your note about this student..."
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading || !content.trim()}
            >
              {isLoading && (
                <span className={styles.loadingSpinner}></span>
              )}
              {isLoading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
