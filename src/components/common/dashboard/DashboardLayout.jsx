import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MainContent from './MainContent';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ 
  children, 
  variant = 'default',
  sidebarCollapsed = false 
}) => {
  const getLayoutClasses = () => {
    let classNames = styles.dashboardLayout;
    
    if (variant === 'dark') {
      classNames += ` ${styles['dashboardLayout--dark']}`;
    }
    
    if (sidebarCollapsed) {
      classNames += ` ${styles['dashboardLayout--collapsed']}`;
    }
    
    return classNames;
  };

  return (
    <div className={getLayoutClasses()}>
      <Sidebar />
      <div className={styles.dashboardLayout__content}>
        <Navbar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;