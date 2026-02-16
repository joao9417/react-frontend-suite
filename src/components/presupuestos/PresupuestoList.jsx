import { useState } from "react";
import { Trash2, AlertTriangle, MapPin, User, Hash, Share2, CornerUpLeft } from "lucide-react";
import { toast } from 'react-hot-toast';
import presupuestosService from '../../services/presupuestoService';
import ShareBudgetModal from './ShareBudgetModal';

const PresupuestoList = ({ presupuestos, onUpdate }) => {
    // Estado para controlar que presupuesto se quiere borrar
    const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
    const [presupuestoACompartir, setPresupuestoACompartir] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const handleEliminar = async () => {
        if (!presupuestoAEliminar) return;

        setIsDeleting(true);
        try {
            await presupuestosService.deletePresupuesto(presupuestoAEliminar.id);
            toast.success('Presupuesto movido a la papelera');
            onUpdate(); // Refresca la lista en el componente padre
            setPresupuestoAEliminar(null); // Cierra el modal
        } catch (error) {
            console.error(error);
            toast.error('No se pudo eliminar el presupuesto');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleShare = async (id, userId) => {
        try {
            await presupuestosService.compartirPresupuesto(id, userId);
            toast.success('Presupuesto compartido correctamente');
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error('Error al compartir el presupuesto');
        }
    };

    const handleDevolver = async (presupuesto) => {
        if (!confirm(`¿Estás seguro de devolver la versión modificada de "${presupuesto.nombre_proyecto}" al dueño original?`)) return;

        setIsReturning(true);
        try {
            await presupuestosService.devolverPresupuesto(presupuesto.id);
            toast.success('Versión devuelta al dueño original');
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error('Error al devolver el presupuesto');
        } finally {
            setIsReturning(false);
        }
    };

    return (
        <div className="space-y-4">
            {presupuestos.map((p) => {
                 const isOwner = p.creado_por === currentUser.id;
                 const isLoaned = p.es_prestamo;
                 const canReturn = isLoaned && isOwner; // Si es prestamo y soy el creador (del préstamo), puedo devolverlo
                 // Ajuste logica: Si es prestamo, el 'creado_por' es el usuario actual (target). 
                 // El 'dueno_original' es quien lo prestó.
                 
                return (
                <div 
                    key={p.id} 
                    className={`group border p-4 rounded-lg shadow-sm transition-all ${
                        isLoaned ? 'bg-blue-50 border-blue-200' : 'bg-white hover:border-gray-300'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-blue-700">
                                    {p.nombre_proyecto} 
                                </h3>
                                {isLoaned && (
                                    <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Share2 size={10} />
                                        Prestado
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Cliente: {p.cliente} | Ubicación: {p.ubicacion_geografica}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                ID: {p.id}
                            </span>
                            
                            {/* Boton Compartir (Solo dueños de presupuestos no prestados) */}
                            {!isLoaned && isOwner && (
                                <button 
                                    onClick={() => setPresupuestoACompartir(p)}
                                    className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                                    title="Compartir presupuesto"
                                >
                                    <Share2 size={18} />
                                </button>
                            )}

                            {/* Boton Devolver (Solo para presupuestos prestados) */}
                            {canReturn && (
                                <button 
                                    onClick={() => handleDevolver(p)}
                                    disabled={isReturning}
                                    className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
                                    title="Devolver versión al dueño"
                                >
                                    <CornerUpLeft size={18} />
                                </button>
                            )}

                            <button 
                                onClick={() => setPresupuestoAEliminar(p)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar presupuesto"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                        {p.especialidades_detalle?.map(esp => (
                            <span key={esp.id} className="text-xs bg-white border border-blue-100 text-blue-600 px-2 py-1 rounded">
                                {esp.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            )})}
            
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

            <ShareBudgetModal 
                isOpen={!!presupuestoACompartir}
                onClose={() => setPresupuestoACompartir(null)}
                onShare={handleShare}
                presupuesto={presupuestoACompartir}
            />
        </div>
    );
};

export default PresupuestoList;