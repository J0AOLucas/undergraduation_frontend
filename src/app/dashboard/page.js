'use client';

import Layout from '@/components/layout/Layout';
import styles from './dashboard.module.css';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function DashboardPage() {
  const [students, setStudents] = useState([]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'higher_intent':
        return styles.studentStatusBlue;
      case 'shortlisting':
        return styles.studentStatusYellow;
      case 'applying':
        return styles.studentStatusPurple;
      case 'submitted':
        return styles.studentStatusGreen;
      default:
        return styles.studentStatusBlue;
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await api.getStudents();
        setStudents(studentsData);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Layout>
      <div className={styles.dashboard}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
          </div>
          
          {/* Statistics Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Students</p>
                <p className={styles.statValue}>{students.filter(student => student.status !== 'archived').length}</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Shortlisting</p>
                <p className={styles.statValue}>{students.filter(student => student.status === 'shortlisting').length}</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Applying</p>
                <p className={styles.statValue}>{students.filter(student => student.status === 'applying').length}</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Applied</p>
                <p className={styles.statValue}>{students.filter(student => student.status === 'submitted').length}</p>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className={styles.quickFilters}>
            <h2 className={styles.quickFiltersTitle}>Quick Filters</h2>
            <div className={styles.filtersGrid}>
              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotRed}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>Higher Intent</p>
                    <p className={styles.filterDescription}>{students.filter(student => student.status === 'higher_intent').length} students</p>
                  </div>
                </div>
              </button>
              
              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotGreen}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>Shortlisting</p>
                    <p className={styles.filterDescription}>{students.filter(student => student.status === 'shortlisting').length} students</p>
                  </div>
                </div>
              </button>
              
              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotBlue}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>Applying</p>
                    <p className={styles.filterDescription}>{students.filter(student => student.status === 'applying').length} students</p>
                  </div>
                </div>
              </button>

              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotYellow}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>Submitted</p>
                    <p className={styles.filterDescription}>{students.filter(student => student.status === 'submitted').length} students</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity and Students */}
          <div className={styles.contentGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Recent Students</h3>
              <div className={styles.studentList}>
                {students.slice(0, 3).map((student) => (
                  <div className={styles.studentItem} key={student.id}>
                    <div className={styles.studentInfo}>
                      <div className={`${styles.studentAvatar} ${styles.studentAvatarBlue}`}>
                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                      </div>
                      <div className={styles.studentDetails}>
                        <p className={styles.studentName}>{student.first_name} {student.last_name}</p>
                        <p className={styles.studentLocation}>{student.country} • Grade: {student.grade}</p>
                      </div>
                    </div>
                    <span className={`${styles.studentStatus} ${getStatusStyle(student.status)}`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles.activityDotGreen}`}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>New student registered: Pedro Lima</p>
                    <span className={styles.activityTime}>2h ago</span>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles.activityDotBlue}`}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Email sent to John Silva</p>
                    <span className={styles.activityTime}>4h ago</span>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles.activityDotYellow}`}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Application status updated</p>
                    <span className={styles.activityTime}>6h ago</span>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles.activityDotPurple}`}></div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Essay feedback provided</p>
                    <span className={styles.activityTime}>1d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
