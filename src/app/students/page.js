'use client';

import Layout from '@/components/layout/Layout';
import styles from './students.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    country: '',
    grade: ''
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const studentsData = await api.getStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on current filters
  useEffect(() => {
    try {
      let filtered = students;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(student => 
          (student.first_name && student.first_name.toLowerCase().includes(searchTerm)) ||
          (student.last_name && student.last_name.toLowerCase().includes(searchTerm)) ||
          (student.email && student.email.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.status) {
        filtered = filtered.filter(student => student.status === filters.status);
      }

      if (filters.country) {
        filtered = filtered.filter(student => 
          student.country && student.country.toLowerCase().includes(filters.country.toLowerCase())
        );
      }

      if (filters.grade) {
        filtered = filtered.filter(student => student.grade && student.grade === filters.grade);
      }

      setFilteredStudents(filtered);
    } catch (error) {
      console.error('Error filtering students:', error);
      setFilteredStudents(students); // Fallback to original list
    }
  }, [students, filters]);

  const handleFilterChange = (key, value) => {
    try {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    } catch (error) {
      console.error('Error updating filter:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      country: '',
      grade: ''
    });
  };

  const handleStudentClick = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'exploring':
        return styles.statusHigherIntent;
      case 'shortlisting':
        return styles.statusShortlisting;
      case 'applying':
        return styles.statusApplying;
      case 'submitted':
        return styles.statusApplying;
      default:
        return styles.statusHigherIntent;
    }
  };

  const getAvatarStyle = (status) => {
    switch (status) {
      case 'exploring':
        return styles.studentAvatarBlue;
      case 'shortlisting':
        return styles.studentAvatarYellow;
      case 'applying':
        return styles.studentAvatarGreen;
      case 'submitted':
        return styles.studentAvatarPurple;
      default:
        return styles.studentAvatarBlue;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueCountries = () => {
    return [...new Set(students.map(student => student.country).filter(country => country))].sort();
  };

  const getUniqueGrades = () => {
    return [...new Set(students.map(student => student.grade).filter(grade => grade))].sort();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.studentsContainer}>
          <div className={styles.mainContent}>
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading students...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.studentsContainer}>
        <div className={styles.mainContent}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Students</h1>
            <button className={styles.addButton}>
              + Add Student
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filtersSection}>
            <h3 className={styles.filtersTitle}>Filters</h3>
            <div className={styles.filtersGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Search</label>
                <input
                  type="text"
                  className={styles.filterInput}
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Status</label>
                <select
                  className={styles.filterSelect}
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="exploring">Higher Intent</option>
                  <option value="shortlisting">Shortlisting</option>
                  <option value="applying">Applying</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Country</label>
                <select
                  className={styles.filterSelect}
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">All Countries</option>
                  {getUniqueCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Grade</label>
                <select
                  className={styles.filterSelect}
                  value={filters.grade}
                  onChange={(e) => handleFilterChange('grade', e.target.value)}
                >
                  <option value="">All Grades</option>
                  {getUniqueGrades().map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <button 
                  className={styles.clearFiltersButton}
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className={styles.studentsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableRow}>
                <div>Student</div>
                <div>Status</div>
                <div>Country</div>
                <div>Grade</div>
                <div>Phone</div>
                <div>Last Contact</div>
                <div>Created</div>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyStateTitle}>No students found</h3>
                <p className={styles.emptyStateDescription}>
                  {students.length === 0 
                    ? "No students have been added yet." 
                    : "Try adjusting your filters to see more results."
                  }
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className={styles.tableRow}>
                  <div className={styles.tableCell} data-label="Student">
                    <div className={`${styles.studentAvatar} ${getAvatarStyle(student.status)}`}>
                      {(student.first_name && student.last_name) 
                        ? `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`
                        : 'N/A'
                      }
                    </div>
                    <div className={styles.studentInfo}>
                      <p 
                        className={styles.studentName}
                        onClick={() => handleStudentClick(student.id)}
                        style={{ cursor: 'pointer', color: '#3b82f6' }}
                      >
                        {student.first_name && student.last_name 
                          ? `${student.first_name} ${student.last_name}`
                          : 'Unknown Student'
                        }
                      </p>
                      <p className={styles.studentEmail}>{student.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className={styles.tableCell} data-label="Status">
                    <span className={`${styles.statusBadge} ${getStatusStyle(student.status)}`}>
                      {student.status ? student.status.replace('_', ' ') : 'Unknown'}
                    </span>
                  </div>

                  <div className={styles.tableCell} data-label="Country">
                    <span className={styles.countryText}>{student.country || 'Unknown'}</span>
                  </div>

                  <div className={styles.tableCell} data-label="Grade">
                    <span className={styles.gradeText}>{student.grade || 'N/A'}</span>
                  </div>

                  <div className={styles.tableCell} data-label="Phone">
                    <span className={styles.phoneText}>{student.phone_number || 'N/A'}</span>
                  </div>

                  <div className={styles.tableCell} data-label="Last Contact">
                    <span className={styles.dateText}>
                      {formatDate(student.last_contact)}
                    </span>
                  </div>

                  <div className={styles.tableCell} data-label="Created">
                    <span className={styles.dateText}>
                      {formatDate(student.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
