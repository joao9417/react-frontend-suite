import React from 'react';
import styles from './MainContent.module.css';

const MainContent = ({ 
  children, 
  variant = 'default',
  paddingSize = 'medium'
}) => {
  const getContentClasses = () => {
    let classNames = styles.mainContent;
    
    if (variant === 'dark') {
      classNames += ` ${styles['mainContent--dark']}`;
    }
    
    if (paddingSize === 'none') {
      classNames += ` ${styles['mainContent--noPadding']}`;
    } else if (paddingSize === 'small') {
      classNames += ` ${styles['mainContent--smallPadding']}`;
    } else if (paddingSize === 'large') {
      classNames += ` ${styles['mainContent--largePadding']}`;
    }
    
    return classNames;
  };

  return (
    <main className={getContentClasses()}>
      {children}
    </main>
  );
};

export default MainContent;