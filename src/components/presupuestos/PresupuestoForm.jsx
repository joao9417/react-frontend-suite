// components/PresupuestoForm.jsx
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
    }, [cargarEspecialidades]);

    const onSubmit = async (data) => {
        // Convertir IDs a números si es necesario
        const formattedData = {
            ...data,
            ingeniero_responsable: parseInt(data.ingeniero_responsable),
            especialidad: data.especialidad ? parseInt(data.especialidad) : null,
        };

        const result = await handleCrear(formattedData);
        
        if (result.success) {
            // Resetear formulario
            reset();
            
            // Notificar al componente padre si existe callback
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
                <label className="block text-sm font-medium mb-1">
                    Especialidad
                </label>
                <select
                    {...register('especialidad')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    disabled={loadingEspecialidades}
                >
                    <option value="">{loadingEspecialidades ? 'Cargando...' : 'Seleccionar especialidad...'}</option>
                    {especialidades.map(especialidad => (
                        <option key={especialidad.id} value={especialidad.id}>
                            {especialidad.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isSubmitting ? 'Creando presupuesto...' : 'Crear Presupuesto'}
                </button>
            </div>
        </form>
    );
};

export default PresupuestoForm;