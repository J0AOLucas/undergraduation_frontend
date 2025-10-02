'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Students', href: '/students', icon: '👥' },
    { name: 'Communications', href: '/communications', icon: '💬' },
    { name: 'Insights', href: '/insights', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <span>U</span>
          </div>
          <h1 className={styles.brandText}>Undergraduation CRM</h1>
        </div>
        <nav className={styles.navigation}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
