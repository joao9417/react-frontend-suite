import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { usePresupuestos } from '../../hooks/usePresupuestos';
import { toast } from 'react-hot-toast';

const PresupuestoForm = ({ onSuccess, ingenieros = [] }) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        reset 
    } = useForm();
    
    const { handleCrear, cargarEspecialidades, especialidades } = usePresupuestos();
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

    // Cargar especialidades al montar el componente
    useEffect(() => {
        const fetchEspecialidades = async () => {
            setLoadingEspecialidades(true);
            try {
                await cargarEspecialidades();
            } catch (error) {
                toast.error('Error al cargar especialidades');
            } finally {
                setLoadingEspecialidades(false);
            }
        };
        
        fetchEspecialidades();
    }, []);

    const onSubmit = async (data) => {
        const formattedData = {
            nombre_proyecto: data.nombre,
            ingeniero_responsable: parseInt(data.ingeniero_responsable),
            especialidades: data.especialidades ? data.especialidades.map(id => parseInt(id)) : [],
            validez_oferta: "2024-12-31",
            tipo_proyecto: "cotizacion",
            formas_pago: "30% anticipo, 40% avance, 30% final",
            cliente: data.cliente,
            ubicacion_geografica: data.ubicacion_geografica,
            version_presupuesto: "1.0",
        };

        const result = await handleCrear(formattedData);
        
        if (result.success) {
            reset();
            if (onSuccess) {
                onSuccess(result.data);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Nombre del Proyecto *
                </label>
                <input
                    {...register('nombre', { 
                        required: 'Este campo es requerido',
                        minLength: {
                            value: 3,
                            message: 'Mínimo 3 caracteres'
                        }
                    })}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                        errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Proyecto Residencial XYZ"
                />
                {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Descripción
                </label>
                <textarea
                    {...register('descripcion')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows="3"
                    placeholder="Describe el proyecto..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Cliente *
                </label>
                <input
                    {...register('cliente', { 
                        required: 'Este campo es requerido'
                    })}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                        errors.cliente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del cliente"
                />
                {errors.cliente && (
                    <p className="text-red-500 text-sm mt-1">{errors.cliente.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Ubicación Geográfica *</label>
                <input
                    {...register('ubicacion_geografica', { required: 'La ubicación es obligatoria' })}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                        errors.ubicacion_geografica ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Medellín, Colombia"
                />
                {errors.ubicacion_geografica && (
                    <p className="text-red-500 text-sm mt-1">{errors.ubicacion_geografica.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Ingeniero Responsable *
                </label>
                <select
                    {...register('ingeniero_responsable', { 
                        required: 'Selecciona un ingeniero',
                        validate: value => value !== "" || 'Este campo es requerido'
                    })}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                        errors.ingeniero_responsable ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Seleccionar ingeniero...</option>
                    {ingenieros.map(ingeniero => (
                        <option key={ingeniero.id} value={ingeniero.id}>
                            {ingeniero.username} - {ingeniero.email}
                        </option>
                    ))}
                </select>
                {errors.ingeniero_responsable && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.ingeniero_responsable.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Especialidades Relacionadas *
                </label>
                
                {loadingEspecialidades ? (
                    <p className="text-sm text-gray-500 animate-pulse">Cargando especialidades...</p>
                ) : (
                    <div className="mt-1 block w-full rounded-md border border-gray-300 p-3 bg-gray-50 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 custom-scrollbar">
                            {especialidades.map(especialidad => (
                                <label 
                                    key={especialidad.id} 
                                    className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        value={especialidad.id}
                                        {...register('especialidades', { 
                                            required: 'Selecciona al menos una especialidad' 
                                        })}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {especialidad.nombre}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                
                {errors.especialidades && (
                    <p className="text-red-500 text-sm mt-1">{errors.especialidades.message}</p>
                )}
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-md transition-all font-medium flex items-center justify-center gap-2 ${
                        isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-200'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
                            Procesando...
                        </>
                    ) : '🚀 Crear Presupuesto'}
                </button>
            </div>
        </form>
    );
};

export default PresupuestoForm;