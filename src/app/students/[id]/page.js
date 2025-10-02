'use client';

import Layout from '@/components/layout/Layout';
import styles from './profile.module.css';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';
import NoteModal from '@/components/NoteModal/NoteModal';

export default function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get specific student by ID
        const studentData = await api.getStudent(params.id);
        setStudent(studentData);
      } catch (err) {
        console.error('Failed to fetch student:', err);
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError('Student not found');
        } else {
          setError('Failed to load student data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesData = await api.getStudentNotes(params.id);
        
        // Handle response format
        if (Array.isArray(notesData)) {
          setNotes(notesData);
        } else if (notesData && Array.isArray(notesData.data)) {
          setNotes(notesData.data);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setNotes([]);
      }
    };

    if (params.id) {
      fetchNotes();
    }
  }, [params.id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'higher_intent':
        return styles.statusHigherIntent;
      case 'shortlisting':
        return styles.statusShortlisting;
      case 'applying':
        return styles.statusApplying;
      case 'submitted':
        return styles.statusSubmitted;
      default:
        return styles.statusHigherIntent;
    }
  };

  const getAvatarStyle = (status) => {
    switch (status) {
      case 'higher_intent':
        return styles.profileAvatarBlue;
      case 'shortlisting':
        return styles.profileAvatarYellow;
      case 'applying':
        return styles.profileAvatarGreen;
      case 'submitted':
        return styles.profileAvatarPurple;
      default:
        return styles.profileAvatarBlue;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleAction = (action) => {
    if (action === 'note') {
      setIsNoteModalOpen(true);
    } else {
      console.log(`Action: ${action} for student: ${student.id}`);
    }
  };

  const handleNoteAdded = async () => {
    // Refresh notes after adding a new one
    try {
      const notesData = await api.getStudentNotes(params.id);
      
      // Handle response format
      if (Array.isArray(notesData)) {
        setNotes(notesData);
      } else if (notesData && Array.isArray(notesData.data)) {
        setNotes(notesData.data);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Failed to refresh notes:', err);
      setNotes([]);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.profileContainer}>
          <div className={styles.mainContent}>
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading student profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className={styles.profileContainer}>
          <div className={styles.mainContent}>
            <div className={styles.errorState}>
              <h2 className={styles.errorTitle}>Error</h2>
              <p className={styles.errorDescription}>
                {error || 'Student not found'}
              </p>
              <button 
                className={styles.retryButton}
                onClick={() => router.push('/students')}
              >
                Back to Students
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <div className={styles.mainContent}>
          {/* Header */}
          <div className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Students
            </button>
            <h1 className={styles.title}>Student Profile</h1>
          </div>

          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={`${styles.profileAvatar} ${getAvatarStyle(student.status)}`}>
                {(student.first_name && student.last_name) 
                  ? `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`
                  : 'N/A'
                }
              </div>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>
                  {student.first_name && student.last_name 
                    ? `${student.first_name} ${student.last_name}`
                    : 'Unknown Student'
                  }
                </h2>
                <p className={styles.profileEmail}>{student.email || 'No email'}</p>
                <span className={`${styles.profileStatus} ${getStatusStyle(student.status)}`}>
                  {student.status ? student.status.replace('_', ' ') : 'Unknown'}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className={styles.profileDetails}>
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Full Name</span>
                  <span className={styles.detailValue}>
                    {student.first_name && student.last_name 
                      ? `${student.first_name} ${student.last_name}`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>{student.email || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone</span>
                  <span className={styles.detailValue}>{student.phone_number || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Country</span>
                  <span className={styles.detailValue}>{student.country || 'N/A'}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Academic Information</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Grade</span>
                  <span className={styles.detailValue}>{student.grade || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {student.status ? student.status.replace('_', ' ') : 'N/A'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Student ID</span>
                  <span className={styles.detailValue}>{student.id || 'N/A'}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Timeline</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created</span>
                  <span className={styles.detailValue}>{formatDate(student.created_at)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Updated</span>
                  <span className={styles.detailValue}>{formatDate(student.updated_at)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Contact</span>
                  <span className={styles.detailValue}>{formatDate(student.last_contact)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Active</span>
                  <span className={styles.detailValue}>{formatDate(student.last_active)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className={styles.actionsSection}>
            <h3 className={styles.actionsTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <button 
                className={styles.actionButton}
                onClick={() => handleAction('email')}
              >
                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={styles.actionText}>Send Email</span>
              </button>

              <button 
                className={styles.actionButton}
                onClick={() => handleAction('call')}
              >
                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={styles.actionText}>Make Call</span>
              </button>

              <button 
                className={styles.actionButton}
                onClick={() => handleAction('note')}
              >
                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className={styles.actionText}>Add Note</span>
              </button>

              <button 
                className={styles.actionButton}
                onClick={() => handleAction('schedule')}
              >
                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={styles.actionText}>Schedule Meeting</span>
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className={styles.communicationSection}>
            <h3 className={styles.communicationTitle}>Internal Notes</h3>
            <div className={styles.communicationList}>
              {notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <p>No internal notes yet.</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Click "Add Note" above to create the first note.
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className={styles.communicationItem}>
                    <div className={styles.communicationIcon}>📝</div>
                    <div className={styles.communicationContent}>
                      <p className={styles.communicationType}>Internal Note</p>
                      <p className={styles.communicationMessage}>{note.content}</p>
                      <p className={styles.communicationDate}>
                        By {note.author} • {formatDate(note.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        studentId={student?.id}
        onNoteAdded={handleNoteAdded}
      />
    </Layout>
  );
}
