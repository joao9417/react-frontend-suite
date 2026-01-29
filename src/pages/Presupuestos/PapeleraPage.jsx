import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, RefreshCcw } from "lucide-react";
import { toast } from 'react-hot-toast';
import presupuestoService from '../../services/presupuestoService';
import styles from '../Home/DashboardPage.module.css'; // Reusing dashboard styles

const PapeleraPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presupuestoARestaurar, setPresupuestoARestaurar] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  useEffect(() => {
    const fetchPresupuestosEliminados = async () => {
      try {
        const data = await presupuestoService.getPresupuestosEliminados();
        setPresupuestos(data);
      } catch (error) {
        console.error("Error al obtener presupuestos eliminados:", error);
        toast.error("Error al cargar la papelera");
      } finally {
        setLoading(false);
      }
    };
    fetchPresupuestosEliminados();
  }, []);

  const handleRestaurar = async () => {
      if (!presupuestoARestaurar) return;

      setIsRestoring(true);
      try {
        // Asumimos que el servicio update funciona para cambiar el estado activo=True
        await presupuestoService.updatePresupuesto(presupuestoARestaurar.id, { activo: true });
        toast.success('Presupuesto restaurado correctamente');
        setPresupuestos(prev => prev.filter(p => p.id !== presupuestoARestaurar.id));
        setPresupuestoARestaurar(null);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo restaurar el presupuesto');
      } finally {
        setIsRestoring(false);
      }
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardPage__container}>
        <div className="flex items-center gap-3 mb-6">
            <Trash2 size={32} className="text-red-500" />
            <h1 className={styles.dashboardPage__title} style={{ marginBottom: 0 }}>Papelera de Reciclaje</h1>
        </div>
        <p className={styles.dashboardPage__description}>
          Presupuestos eliminados. Puedes restaurarlos si es necesario.
        </p>

        {loading ? (
          <p>Cargando papelera...</p>
        ) : (
          <div className={styles.dashboardPage__grid}>
            {presupuestos.length > 0 ? (
              presupuestos.map((p) => (
                <div 
                  key={p.id} 
                  className={styles.presupuestoCard}
                  style={{ borderColor: '#ef4444', opacity: 0.8 }}
                >

                  <div className={styles.presupuestoCard__header}>
                    <span className={styles.consecutivo}>#{p.consecutivo}</span>
                    <h3 className="line-through text-gray-500">{p.nombre_proyecto}</h3>
                  </div>

                  <div className={styles.presupuestoCard__body}>
                    <p><strong>Responsable:</strong> {p.nombre_ingeniero_responsable || 'No asignado'}</p>
                    <p><strong>Eliminado:</strong> {p.fecha_modificacion ? new Date(p.fecha_modificacion).toLocaleDateString() : 'Desconocido'}</p>
                  </div>

                  <div className={styles.presupuestoCard__actions}>
                      <button 
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                          onClick={() => setPresupuestoARestaurar(p)}
                      >
                          <RefreshCcw size={18} />
                          Restaurar
                      </button>
                  </div>
                </div>
                
              ))
            ) : (
              <p className="text-gray-500 italic">La papelera está vacía.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Restaurar */}
      {presupuestoARestaurar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center gap-3 mb-4 text-green-600">
                      <RefreshCcw size={24} />
                      <h3 className="text-lg font-bold">Confirmar Restauración</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                      ¿Deseas restaurar el presupuesto <span className="font-semibold text-gray-900">{presupuestoARestaurar.nombre_proyecto}</span>? 
                      <br/><span className="text-sm mt-1 block">Volverá a aparecer en tu lista principal.</span>
                  </p>
                  
                  <div className="flex justify-end gap-3">
                      <button
                          onClick={() => setPresupuestoARestaurar(null)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                          disabled={isRestoring}
                      >
                          Cancelar
                      </button>
                      <button
                          onClick={handleRestaurar}
                          disabled={isRestoring}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isRestoring ? 'Restaurando...' : 'Restaurar'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PapeleraPage;
