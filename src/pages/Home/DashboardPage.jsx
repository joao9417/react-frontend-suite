import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import presupuestoService from '../../services/presupuestoService';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const data = await presupuestoService.getPresupuestos();
        setPresupuestos(data);
      } catch (error) {
        console.error("Error al obtener presupuestos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPresupuestos();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/presupuestos/${id}`);
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardPage__container}>
        <h1 className={styles.dashboardPage__title}>Mis Presupuestos</h1>
        <p className={styles.dashboardPage__description}>
          Gestión de proyectos y cotizaciones activas.
        </p>

        {loading ? (
          <p>Cargando presupuestos...</p>
        ) : (
          <div className={styles.dashboardPage__grid}>
            {presupuestos.length > 0 ? (
              presupuestos.map((p) => (
                <div 
                  key={p.id} 
                  className={styles.presupuestoCard}
                  onClick={() => handleVerDetalle(p.id)}
                  style={{ cursor: 'pointer' }}
                >

                  <div className={styles.presupuestoCard__header}>
                    <span className={styles.consecutivo}>#{p.consecutivo}</span>
                    <h3>{p.nombre_proyecto}</h3>
                  </div>

                  <div className={styles.presupuestoCard__body}>
                    <p><strong>Responsable:</strong> {p.nombre_ingeniero_responsable || 'No asignado'}</p>
                    <p><strong>Fecha:</strong> {new Date(p.fecha_creacion).toLocaleDateString()}</p>
                    <div className={styles.tags}>
                      {p.especialidades_detalle?.map(esp => (
                        <span key={esp.id} className={styles.tag}>{esp.nombre}</span>
                      ))}
                    </div>
                  </div>

                  <button 
                    className={styles.btnVer}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerDetalle(p.id); 
                    }}
                    >
                      Ver Detalles
                  </button>
                </div>
                
              ))
            ) : (
              <p>No tienes presupuestos creados aún.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;