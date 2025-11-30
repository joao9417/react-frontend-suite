import React from 'react';
import DashboardLayout from '../../components/common/dashboard/DashboardLayout';
import styles from './DashboardPage.module.css';

const DashboardPage = ({ variant = 'default' }) => {
  const getPageClasses = () => {
    let classNames = styles.dashboardPage;
    
    if (variant === 'dark') {
      classNames += ` ${styles['dashboardPage--dark']}`;
    }
    
    return classNames;
  };

  return (
    <DashboardLayout>
      <div className={getPageClasses()}>
        <div className={styles.dashboardPage__container}>
          <h1 className={styles.dashboardPage__title}>Bienvenido al Dashboard</h1>
          <p className={styles.dashboardPage__description}>
            Aquí podrás gestionar tus presupuestos y configuraciones.
          </p>

          {/* Ejemplo de contenido del dashboard */}
          <div className={styles.dashboardPage__grid}>
            {/* Tarjeta 1: Estadísticas Rápidas */}
            <div className={styles.dashboardPage__card}>
              <h2 className={styles.dashboardPage__cardTitle}>Estadísticas Rápidas</h2>
              <p className={styles.dashboardPage__cardText}>Presupuestos activos: 5</p>
              <p className={styles.dashboardPage__cardText}>Gastos del mes: $1,200</p>
            </div>

            {/* Tarjeta 2: Últimos Movimientos */}
            <div className={styles.dashboardPage__card}>
              <h2 className={styles.dashboardPage__cardTitle}>Últimos Movimientos</h2>
              <ul className={styles.dashboardPage__list}>
                <li className={styles.dashboardPage__listItem}>Compra supermercado: -$150</li>
                <li className={styles.dashboardPage__listItem}>Salario: +$2,500</li>
                <li className={styles.dashboardPage__listItem}>Factura luz: -$80</li>
              </ul>
            </div>

            {/* Tarjeta 3: Acceso Rápido */}
            <div className={styles.dashboardPage__card}>
              <h2 className={styles.dashboardPage__cardTitle}>Acceso Rápido</h2>
              <button className={styles.dashboardPage__button}>
                Ver Presupuestos
              </button>
              <button className={`${styles.dashboardPage__button} ${styles['dashboardPage__button--secondary']}`}>
                Añadir Gasto
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;