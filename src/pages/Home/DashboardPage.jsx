import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from 'react-hot-toast';
import presupuestoService from '../../services/presupuestoService';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleEliminar = async () => {
    if (!presupuestoAEliminar) return;

    setIsDeleting(true);
    try {
        await presupuestoService.deletePresupuesto(presupuestoAEliminar.id);
        toast.success('Presupuesto movido a la papelera');
        setPresupuestos(prev => prev.filter(p => p.id !== presupuestoAEliminar.id));
        setPresupuestoAEliminar(null);
    } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el presupuesto');
    } finally {
        setIsDeleting(false);
    }
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

                  <div className={styles.presupuestoCard__actions}>
                      <button 
                        className={styles.btnVer}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(p.id); 
                        }}
                      >
                          Ver Detalles
                      </button>
                      <button 
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                          onClick={(e) => {
                              e.stopPropagation();
                              setPresupuestoAEliminar(p);
                          }}
                          title="Eliminar presupuesto"
                      >
                          <Trash2 size={20} />
                      </button>
                  </div>


                </div>
                
              ))
            ) : (
              <p>No tienes presupuestos creados aún.</p>
            )}
          </div>
        )}
      </div>
      {presupuestoAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center gap-3 mb-4 text-red-600">
                      <AlertTriangle size={24} />
                      <h3 className="text-lg font-bold">Confirmar eliminación</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                      ¿Estás seguro de que deseas eliminar el presupuesto <span className="font-semibold text-gray-900">{presupuestoAEliminar.nombre_proyecto}</span>? 
                      <br/><span className="text-sm mt-1 block">Esta acción no se puede deshacer.</span>
                  </p>
                  
                  <div className="flex justify-end gap-3">
                      <button
                          onClick={() => setPresupuestoAEliminar(null)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                          disabled={isDeleting}
                      >
                          Cancelar
                      </button>
                      <button
                          onClick={handleEliminar}
                          disabled={isDeleting}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardPage;