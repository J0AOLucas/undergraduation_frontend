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
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [commType, setCommType] = useState('');
  const [reminderForm, setReminderForm] = useState({
    type: 'call_student',
    dueDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const fetchApplications = async () => {
      try {
        const applicationsData = await api.getApplications(params.id);
        
        // Handle response format
        if (Array.isArray(applicationsData)) {
          setApplications(applicationsData);
        } else if (applicationsData && Array.isArray(applicationsData.data)) {
          setApplications(applicationsData.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApplications([]);
      }
    };

    const fetchReminders = async () => {
      try {
        const remindersData = await api.getReminders(params.id);
        
        // Handle response format
        if (Array.isArray(remindersData)) {
          setReminders(remindersData);
        } else if (remindersData && Array.isArray(remindersData.data)) {
          setReminders(remindersData.data);
        } else {
          setReminders([]);
        }
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
        setReminders([]);
      }
    };

    const fetchDocuments = async () => {
      try {
        const documentsData = await api.getStudentDocuments(params.id);
        
        // Handle response format
        if (Array.isArray(documentsData)) {
          setDocuments(documentsData);
        } else if (documentsData && Array.isArray(documentsData.data)) {
          setDocuments(documentsData.data);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setDocuments([]);
      }
    };

    if (params.id) {
      fetchNotes();
      fetchApplications();
      fetchReminders();
      fetchDocuments();
    }
  }, [params.id]);


  const getStatusStyle = (status) => {
    switch (status) {
      case 'exploring':
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
      case 'exploring':
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

  // Application progress helpers
  const getApplicationStages = () => (['exploring', 'shortlisting', 'applying', 'submitted']);

  const getApplicationStageLabel = (stage) => {
    switch (stage) {
      case 'exploring':
        return 'Higher Intent';
      case 'shortlisting':
        return 'Shortlisting';
      case 'applying':
        return 'Applying';
      case 'submitted':
        return 'Submitted';
      default:
        return 'Unknown';
    }
  };

  const getApplicationProgressPercent = (status) => {
    const stages = getApplicationStages();
    const idx = Math.max(0, stages.indexOf(status));
    const percent = ((idx + 1) / stages.length) * 100;
    return { percent, currentIndex: idx, total: stages.length };
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

  const formatReminderDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReminderTypeLabel = (type) => {
    if (!type) return 'Unknown';
    
    // Convert underscores to spaces and capitalize each word
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getDocumentIcon = (fileName) => {
    if (!fileName) return '📄';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📘';
      case 'xls':
      case 'xlsx':
        return '📗';
      case 'ppt':
      case 'pptx':
        return '📙';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  };

  const getDocumentTypeLabel = (fileName) => {
    if (!fileName) return 'Unknown';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint Presentation';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image File';
      case 'zip':
      case 'rar':
        return 'Archive File';
      default:
        return 'Document';
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAction = (action) => {
    if (action === 'note') {
      setIsNoteModalOpen(true);
    } else if (action === 'log_comm') {
      setCommType('log');
      setIsCommModalOpen(true);
    } else if (action === 'follow_up') {
      setCommType('follow_up');
      setIsCommModalOpen(true);
    } else if (action === 'schedule') {
      setCommType('schedule');
      setIsCommModalOpen(true);
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

  const handleReminderSubmit = async () => {
    if (!reminderForm.dueDate) {
      alert('Please select a due date');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get admin_id from localStorage
      const adminId = localStorage.getItem('admin_id');
      
      // Convert datetime-local to ISO string for backend
      const dueDateISO = reminderForm.dueDate ? new Date(reminderForm.dueDate).toISOString() : null;
      
      const reminderData = {
        student_id: params.id,
        type: reminderForm.type,
        due_date: dueDateISO,
        notes: reminderForm.notes,
        reason: reminderForm.type, // Use type as reason
        author_id: adminId || 'unknown', // Use admin_id from localStorage
        status: 'pending'
      };

      console.log('Creating reminder with data:', reminderData);
      const response = await api.createReminder(reminderData);
      console.log('Reminder created successfully:', response);
      
      // Refresh reminders list
      const remindersData = await api.getReminders(params.id);
      if (Array.isArray(remindersData)) {
        setReminders(remindersData);
      } else if (remindersData && Array.isArray(remindersData.data)) {
        setReminders(remindersData.data);
      }
      
      // Reset form and close modal
      setReminderForm({
        type: 'call_student',
        dueDate: '',
        notes: ''
      });
      setIsCommModalOpen(false);
    } catch (err) {
      console.error('Failed to create reminder:', err);
      alert('Failed to create reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReminderFormChange = (field, value) => {
    setReminderForm(prev => ({
      ...prev,
      [field]: value
    }));
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

          {/* Communication Tools Section */}
          <div className={styles.communicationToolsSection}>
            <h3 className={styles.communicationToolsTitle}>Communication Tools</h3>
            <div className={styles.communicationToolsGrid}>
              <button 
                className={styles.commToolButton}
                onClick={() => handleAction('log_comm')}
              >
                <svg className={styles.commToolIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className={styles.commToolContent}>
                  <span className={styles.commToolTitle}>Log Communication</span>
                  <span className={styles.commToolDescription}>Log communications manually (e.g., "Called student to discuss essays")</span>
                </div>
              </button>

              <button 
                className={styles.commToolButton}
                onClick={() => handleAction('follow_up')}
              >
                <svg className={styles.commToolIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className={styles.commToolContent}>
                  <span className={styles.commToolTitle}>Trigger Follow-up Email</span>
                  <span className={styles.commToolDescription}>Send follow-up email (mock only — no need to send real email)</span>
                </div>
              </button>

              <button 
                className={styles.commToolButton}
                onClick={() => handleAction('schedule')}
              >
                <svg className={styles.commToolIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className={styles.commToolContent}>
                  <span className={styles.commToolTitle}>Schedule Reminder</span>
                  <span className={styles.commToolDescription}>Schedule a reminder or task for the internal team</span>
                </div>
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

        {/* Applications */}
        <div className={styles.applicationsSection}>
          <h3 className={styles.applicationsTitle}>Applications</h3>
          <div className={styles.applicationsList}>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No applications yet.</p>
              </div>
            ) : (
              applications.map((application) => (
                <div key={application.id} className={styles.applicationItem}>
                  <div className={styles.applicationHeader}>
                    <h4 className={styles.applicationProgram}>{application.program || 'Unknown Program'}</h4>
                    <span className={`${styles.applicationStatus} ${getStatusStyle(application.status)}`}>
                      {application.status ? application.status.replace('_', ' ') : 'Unknown'}
                    </span>
                  </div>
                  <p className={styles.applicationUniversity}>{application.university_name || 'N/A'}</p>
                  {/* Progress Bar */}
                  {(() => {
                    const { percent, currentIndex, total } = getApplicationProgressPercent(application.status);
                    const currentLabel = getApplicationStageLabel(getApplicationStages()[currentIndex]);
                    return (
                      <div className={styles.applicationProgress}>
                        <div className={styles.applicationProgressHeader}>
                          <span className={styles.applicationProgressTitle}>Current Progress</span>
                          <span className={styles.applicationProgressValue}>{Math.round(percent)}%</span>
                        </div>
                        <div className={styles.applicationProgressTrack}>
                          <div className={styles.applicationProgressFill} style={{ width: `${percent}%` }} />
                        </div>
                        <div className={styles.applicationProgressCaption}>
                          Stage {currentIndex + 1} of {total}: {currentLabel}
                        </div>
                      </div>
                    );
                  })()}
                  <div className={styles.applicationDates}>
                    <p className={styles.applicationDate}>
                      <strong>Created:</strong> {formatDate(application.created_at)}
                    </p>
                    {application.submittedAt && (
                      <p className={styles.applicationDate}>
                        <strong>Submitted:</strong> {formatDate(application.submittedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders */}
        <div className={styles.remindersSection}>
          <h3 className={styles.remindersTitle}>Reminders & Tasks</h3>
          <div className={styles.remindersList}>
            {reminders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No reminders yet.</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Click "Schedule Reminder" above to create the first reminder.
                </p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className={styles.reminderItem}>
                  <div className={styles.reminderHeader}>
                    <div className={styles.reminderIcon}>
                      <svg className={styles.reminderIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className={styles.reminderContent}>
                      <h4 className={styles.reminderType}>{getReminderTypeLabel(reminder.reason)}</h4>
                      <p className={styles.reminderReason}>{reminder.reason}</p>
                      <div className={styles.reminderDates}>
                        <p className={styles.reminderDate}>
                          <strong>Created:</strong> {formatReminderDate(reminder.created_at)}
                        </p>
                        {reminder.schedule_date && (
                          <p className={styles.reminderDate}>
                            <strong>Due:</strong> {formatReminderDate(reminder.schedule_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={styles.reminderStatus}>
                      <span className={styles.reminderStatusBadge}>Pending</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documents */}
        <div className={styles.documentsSection}>
          <h3 className={styles.documentsTitle}>Documents & Files</h3>
          <div className={styles.documentsList}>
            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>Vazio</p>
              </div>
            ) : (
              documents.map((document) => (
                <div key={document.id} className={styles.documentItem}>
                  <div className={styles.documentHeader}>
                    <div className={styles.documentIcon}>
                      <span className={styles.documentIconEmoji}>{getDocumentIcon(document.file_name || document.name)}</span>
                    </div>
                    <div className={styles.documentContent}>
                      <h4 className={styles.documentName}>{document.name || document.file_name || 'Unknown File'}</h4>
                      <p className={styles.documentType}>{getDocumentTypeLabel(document.name || document.file_name)}</p>
                      <div className={styles.documentInfo}>
                        <p className={styles.documentDate}>
                          <strong>Uploaded:</strong> {formatReminderDate(document.created_at || document.uploaded_at)}
                        </p>
                        {document.file_size && (
                          <p className={styles.documentSize}>
                            <strong>Size:</strong> {document.file_size}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={styles.documentActions}>
                      <button 
                        className={styles.documentDownloadButton}
                        onClick={() => {
                          if (document.file_url || document.download_url || document.url) {
                            window.open(document.file_url || document.download_url || document.url, '_blank');
                          } else {
                            alert('Download URL not available');
                          }
                        }}
                      >
                        <svg className={styles.documentDownloadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
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

      {/* Communication Tools Modal */}
      {isCommModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {commType === 'log' && 'Log Communication'}
                {commType === 'follow_up' && 'Trigger Follow-up Email'}
                {commType === 'schedule' && 'Schedule Reminder'}
              </h3>
              <button 
                className={styles.modalCloseButton}
                onClick={() => setIsCommModalOpen(false)}
              >
                <svg className={styles.modalCloseIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {commType === 'log' && (
                <div className={styles.modalForm}>
                  <label className={styles.modalLabel}>Communication Details</label>
                  <textarea 
                    className={styles.modalTextarea}
                    placeholder="e.g., Called student to discuss essays, discussed application timeline, etc."
                    rows={4}
                  />
                  <div className={styles.modalActions}>
                    <button className={styles.modalButtonSecondary} onClick={() => setIsCommModalOpen(false)}>
                      Cancel
                    </button>
                    <button className={styles.modalButtonPrimary}>
                      Log Communication
                    </button>
                  </div>
                </div>
              )}
              
              {commType === 'follow_up' && (
                <div className={styles.modalForm}>
                  <label className={styles.modalLabel}>Email Template</label>
                  <select className={styles.modalSelect}>
                    <option value="application_reminder">Application Reminder</option>
                    <option value="essay_feedback">Essay Feedback Request</option>
                    <option value="interview_schedule">Interview Scheduling</option>
                    <option value="general_followup">General Follow-up</option>
                  </select>
                  <label className={styles.modalLabel}>Custom Message (Optional)</label>
                  <textarea 
                    className={styles.modalTextarea}
                    placeholder="Add any custom message to include in the email..."
                    rows={3}
                  />
                  <div className={styles.modalActions}>
                    <button className={styles.modalButtonSecondary} onClick={() => setIsCommModalOpen(false)}>
                      Cancel
                    </button>
                    <button className={styles.modalButtonPrimary}>
                      Send Follow-up Email (Mock)
                    </button>
                  </div>
                </div>
              )}
              
              {commType === 'schedule' && (
                <div className={styles.modalForm}>
                  <label className={styles.modalLabel}>Reminder Type</label>
                  <select 
                    className={styles.modalSelect}
                    value={reminderForm.type}
                    onChange={(e) => handleReminderFormChange('type', e.target.value)}
                  >
                    <option value="call_student">Call Student</option>
                    <option value="review_application">Review Application</option>
                    <option value="send_documents">Send Documents</option>
                    <option value="follow_up_check">Follow-up Check</option>
                  </select>
                  <label className={styles.modalLabel}>Due Date</label>
                  <div className={styles.dateTimeContainer}>
                    <div className={styles.dateInputGroup}>
                      <label className={styles.dateSubLabel}>Date</label>
                      <input 
                        type="date" 
                        className={styles.modalDateInput}
                        value={reminderForm.dueDate.split('T')[0] || ''}
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          const timeValue = reminderForm.dueDate.split('T')[1] || '09:00';
                          handleReminderFormChange('dueDate', `${dateValue}T${timeValue}`);
                        }}
                        required
                      />
                    </div>
                    <div className={styles.timeInputGroup}>
                      <label className={styles.dateSubLabel}>Time</label>
                      <input 
                        type="time" 
                        className={styles.modalTimeInput}
                        value={reminderForm.dueDate.split('T')[1] || '09:00'}
                        onChange={(e) => {
                          const timeValue = e.target.value;
                          const dateValue = reminderForm.dueDate.split('T')[0] || '';
                          handleReminderFormChange('dueDate', `${dateValue}T${timeValue}`);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <label className={styles.modalLabel}>Notes</label>
                  <textarea 
                    className={styles.modalTextarea}
                    placeholder="Additional notes for this reminder..."
                    rows={3}
                    value={reminderForm.notes}
                    onChange={(e) => handleReminderFormChange('notes', e.target.value)}
                  />
                  <div className={styles.modalActions}>
                    <button 
                      className={styles.modalButtonSecondary} 
                      onClick={() => setIsCommModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      className={styles.modalButtonPrimary}
                      onClick={handleReminderSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Schedule Reminder'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
