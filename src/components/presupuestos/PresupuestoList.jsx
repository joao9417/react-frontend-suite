import { useState } from "react";
import { Trash2, AlertTriangle, MapPin, User, Hash } from "lucide-react";
import { toast } from 'react-hot-toast';
import presupuestosService from '../../services/presupuestoService';


const PresupuestoList = ({ presupuestos, onUpdate }) => {

    // Estado para controlar que presupuesto se quiere borrar
    const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
 
    return (
        <div className="space-y-4">
            {presupuestos.map((p) => (
                <div key={p.id} className="group border p-4 rounded-lg shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-blue-700">
                                {p.nombre_proyecto} 
                            </h3>
                            <p className="text-sm text-gray-500">
                                Cliente: {p.cliente} | Ubicación: {p.ubicacion_geografica}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                ID: {p.id}
                            </span>
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
                        {p.especialidades_info?.map(esp => (
                            <span key={esp.id} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                {esp.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
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

export default PresupuestoList;