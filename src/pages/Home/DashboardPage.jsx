import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Settings, X, Share2, CornerUpLeft } from "lucide-react";
import { toast } from 'react-hot-toast';
import presupuestoService from '../../services/presupuestoService';
import PresupuestoForm from '../../components/presupuestos/PresupuestoForm'; // Reuse form
import ShareBudgetModal from '../../components/presupuestos/ShareBudgetModal';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Share/Return State
  const [presupuestoACompartir, setPresupuestoACompartir] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  // Edit State
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [ingenieros, setIngenieros] = useState([]); // Needed for form

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

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
    
    // Fetch engineers if user is logged in (simulated based on PresupuestoPage logic)
    const fetchIngenieros = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if(user) setIngenieros([{ id: user.id, username: user.username, email: user.email }]);
        } catch(e) { console.error(e); }
    };
    fetchIngenieros();
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

  const handleShare = async (id, userId) => {
      try {
          await presupuestoService.compartirPresupuesto(id, userId);
          toast.success('Presupuesto compartido correctamente');
          // Refresh list
          const data = await presupuestoService.getPresupuestos();
          setPresupuestos(data);
      } catch (error) {
          console.error(error);
          toast.error('Error al compartir el presupuesto');
      }
  };

  const handleDevolver = async (presupuesto) => {
      if (!confirm(`¿Estás seguro de devolver la versión modificada de "${presupuesto.nombre_proyecto}" al dueño original?`)) return;

      setIsReturning(true);
      try {
          await presupuestoService.devolverPresupuesto(presupuesto.id);
          toast.success('Versión devuelta al dueño original');
          // Refresh list
          const data = await presupuestoService.getPresupuestos();
          setPresupuestos(data);
      } catch (error) {
          console.error(error);
          toast.error('Error al devolver el presupuesto');
      } finally {
          setIsReturning(false);
      }
  };

  const handleEditClick = (presupuesto) => {
      setEditingPresupuesto(presupuesto);
  };

  const handleUpdate = async (data) => {
      try {
          // Call update service
          const response = await presupuestoService.updatePresupuesto(editingPresupuesto.id, data);
          toast.success(`Presupuesto ${response.consecutivo} actualizado!`);
          
          // Update local state
          setPresupuestos(prev => prev.map(p => p.id === editingPresupuesto.id ? response : p));
          setEditingPresupuesto(null);
          return { success: true, data: response }; // Return for form to handle success
      } catch (error) {
          console.error(error);
          toast.error('Error al actualizar presupuesto');
          return { success: false, error };
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
              presupuestos.map((p) => {
                const isOwner = p.creado_por === currentUser.id;
                const isLoaned = p.es_prestamo;
                const canReturn = isLoaned && isOwner;

                return (
                <div 
                  key={p.id} 
                  className={`${styles.presupuestoCard} ${isLoaned ? 'border-2 border-blue-200 bg-blue-50' : ''}`}
                  onClick={() => handleVerDetalle(p.id)}
                  style={{ cursor: 'pointer' }}
                >

                  <div className={styles.presupuestoCard__header}>
                    <div className="flex justify-between w-full items-center">
                        <div>
                            <span className={styles.consecutivo}>#{p.consecutivo}</span>
                            {isLoaned && (
                                <span className="ml-2 text-xs font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <Share2 size={10} /> Prestado
                                </span>
                            )}
                        </div>
                    </div>
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
                      
                       {/* Share Button */}
                       {!isLoaned && isOwner && (
                          <button
                              className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setPresupuestoACompartir(p);
                              }}
                              title="Compartir presupuesto"
                          >
                              <Share2 size={20} />
                          </button>
                       )}

                       {/* Return Button */}
                       {canReturn && (
                          <button
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition-colors"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleDevolver(p);
                              }}
                              disabled={isReturning}
                              title="Devolver versión al dueño"
                          >
                              <CornerUpLeft size={20} />
                          </button>
                       )}

                      {/* Edit Button */}
                      <button
                          className="text-gray-500 hover:text-blue-600 p-2 hover:bg-gray-100 rounded transition-colors"
                          onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(p);
                          }}
                          title="Editar presupuesto"
                      >
                          <Settings size={20} />
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
            )})
            ) : (
              <p>No tienes presupuestos creados aún.</p>
            )}
          </div>
        )}
      </div>

       <ShareBudgetModal 
            isOpen={!!presupuestoACompartir}
            onClose={() => setPresupuestoACompartir(null)}
            onShare={handleShare}
            presupuesto={presupuestoACompartir}
        />

      {/* Modal De Eliminación */}
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

      {/* Modal De Edición */}
      {editingPresupuesto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">Editar Presupuesto</h3>
                    <button 
                        onClick={() => setEditingPresupuesto(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <PresupuestoForm 
                    key={editingPresupuesto ? editingPresupuesto.id : 'new'}
                    initialData={editingPresupuesto}
                    ingenieros={ingenieros}
                    onSubmitMode={handleUpdate}
                    onSuccess={() => setEditingPresupuesto(null)} // Close on success handled in handleUpdate or here
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;