'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    try {
      const storedAdminId = typeof window !== 'undefined' ? localStorage.getItem('admin_id') : null;
      if (!storedAdminId) return;
      const fetchAdmin = async () => {
        try {
          const data = await api.getAdmin(storedAdminId);
          setAdmin(data);
        } catch (_) {}
      };
      fetchAdmin();
    } catch (_) {
      // ignore
    }
  }, []);

  return (
    <div className={styles.header}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={styles.mobileMenuButton}
      >
        <span className="sr-only">Open menu</span>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Separator */}
      <div className={styles.separator} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="search"
            name="search"
            className={styles.searchInput}
            placeholder="Search students, communications..."
            type="search"
          />
        </div>
        <div className={styles.actions}>
          {/* Notifications */}
          <button type="button" className={styles.notificationButton}>
            <span className="sr-only">View notifications</span>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Separator */}
          <div className={styles.actionsSeparator} aria-hidden="true" />

          {/* Profile dropdown */}
          <div className={styles.profileContainer}>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className={styles.profileAvatar}>
                <span>{(admin?.name || admin?.full_name || admin?.email || 'User')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(part => part.charAt(0).toUpperCase())
                  .join('')}</span>
              </div>
              <span className={styles.profileInfo}>
                <span className={styles.profileName} aria-hidden="true">
                  {admin?.first_name}
                </span>
                <svg className={styles.profileChevron} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>

            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <a href="#" className={styles.profileDropdownItem}>
                  Your profile
                </a>
                <a href="#" className={styles.profileDropdownItem}>
                  Settings
                </a>
                <button 
                  onClick={handleLogout}
                  className={styles.profileDropdownItem}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}