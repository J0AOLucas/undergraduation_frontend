import Sidebar from './Sidebar';
import Header from './Header';
import styles from './layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
