import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const userName = 'Usuario Ejemplo';
  const userPhoto = 'https://via.placeholder.com/30';
  const notificationCount = 3;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        {/* Botón de notificaciones */}
        <button 
          className={styles.navbar__notificationBtn}
          aria-label={`Notificaciones: ${notificationCount} sin leer`}
        >
          {/* Icono de campana */}
          <svg 
            className={styles.navbar__notificationIcon} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          
          {/* Badge de notificaciones */}
          {notificationCount > 0 && (
            <span className={styles.navbar__notificationBadge}>
              {notificationCount}
            </span>
          )}
        </button>

        {/* Información del usuario */}
        <div className={styles.navbar__userContainer}>
          <span className={styles.navbar__userName}>{userName}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;