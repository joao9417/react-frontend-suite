// src/components/dashboard/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// Quitamos MainContent si solo era un contenedor vacío
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ variant = 'default', sidebarCollapsed = false }) => {
  const getLayoutClasses = () => {
    let classNames = styles.dashboardLayout;
    if (variant === 'dark') classNames += ` ${styles['dashboardLayout--dark']}`;
    if (sidebarCollapsed) classNames += ` ${styles['dashboardLayout--collapsed']}`;
    return classNames;
  };

  return (
    <div className={getLayoutClasses()}>
      <Sidebar />
      <div className={styles.dashboardLayout__content}>
        <Navbar />
        {/* IMPORTANTE: Solo dejamos el Outlet. 
           No metas aquí el DashboardPage ni el MainContent manualmente.
        */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
           <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;