import Layout from '@/components/layout/Layout';
import styles from './dashboard.module.css';

export default function DashboardPage() {
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
                <p className={styles.statValue}>1,234</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Active Applications</p>
                <p className={styles.statValue}>456</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.logoContainer}`}>
                <img 
                src="/logo.png" 
                alt="Logo" 
                className={styles.logo}
              />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Today's Communications</p>
                <p className={styles.statValue}>23</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Conversion Rate</p>
                <p className={styles.statValue}>68%</p>
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
                    <p className={styles.filterTitle}>Students not contacted in 7 days</p>
                    <p className={styles.filterDescription}>23 students need follow-up</p>
                  </div>
                </div>
              </button>
              
              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotGreen}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>High intent students</p>
                    <p className={styles.filterDescription}>45 students actively applying</p>
                  </div>
                </div>
              </button>
              
              <button className={styles.filterButton}>
                <div className={styles.filterButtonContent}>
                  <div className={`${styles.filterDot} ${styles.filterDotBlue}`}></div>
                  <div className={styles.filterText}>
                    <p className={styles.filterTitle}>Needs essay help</p>
                    <p className={styles.filterDescription}>12 students requesting support</p>
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
                <div className={styles.studentItem}>
                  <div className={styles.studentInfo}>
                    <div className={`${styles.studentAvatar} ${styles.studentAvatarBlue}`}>
                      JS
                    </div>
                    <div className={styles.studentDetails}>
                      <p className={styles.studentName}>John Silva</p>
                      <p className={styles.studentLocation}>Brazil • Application in progress</p>
                    </div>
                  </div>
                  <span className={`${styles.studentStatus} ${styles.studentStatusBlue}`}>
                    Applying
                  </span>
                </div>
                
                <div className={styles.studentItem}>
                  <div className={styles.studentInfo}>
                    <div className={`${styles.studentAvatar} ${styles.studentAvatarGreen}`}>
                      MS
                    </div>
                    <div className={styles.studentDetails}>
                      <p className={styles.studentName}>Maria Santos</p>
                      <p className={styles.studentLocation}>Mexico • Waiting for documents</p>
                    </div>
                  </div>
                  <span className={`${styles.studentStatus} ${styles.studentStatusYellow}`}>
                    Shortlisting
                  </span>
                </div>
                
                <div className={styles.studentItem}>
                  <div className={styles.studentInfo}>
                    <div className={`${styles.studentAvatar} ${styles.studentAvatarPurple}`}>
                      AC
                    </div>
                    <div className={styles.studentDetails}>
                      <p className={styles.studentName}>Ana Costa</p>
                      <p className={styles.studentLocation}>Colombia • Essay review needed</p>
                    </div>
                  </div>
                  <span className={`${styles.studentStatus} ${styles.studentStatusGreen}`}>
                    High Intent
                  </span>
                </div>
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
